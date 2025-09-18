import { GoogleGenAI, Type, Part, GenerateContentResponse, Content } from "@google/genai";
import type { ChatMessage, TriageResult, SafetyAnalysisResult, Resource } from '../types';
import { MENTAL_HEALTH_RESOURCES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// New Safety Analysis Function
const safetyAnalysisPrompt = `
Analyze the user's message for any indication of immediate crisis, self-harm, or harm to others. Your response MUST be a JSON object with the following structure:
{
  "isCrisis": boolean, // true if the user is in immediate distress or mentioning self-harm, otherwise false.
  "reasoning": string // A brief explanation for your decision.
}

Analyze this message:
`;

export const analyzeChatMessageForSafety = async (message: string): Promise<SafetyAnalysisResult> => {
    if (!API_KEY) return { isCrisis: false, reasoning: "API key not configured." };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${safetyAnalysisPrompt}"${message}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCrisis: { type: Type.BOOLEAN },
                        reasoning: { type: Type.STRING }
                    },
                    required: ["isCrisis", "reasoning"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as SafetyAnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API for safety analysis:", error);
        // Default to non-crisis on API failure to avoid accidentally blocking non-crisis users.
        // A real implementation would have more robust error handling and logging here.
        return { isCrisis: false, reasoning: "Safety check failed due to an API error." };
    }
};


const triageAnalysisPrompt = `
You are a symptom checker and triage assistant for a healthcare app.
You do not diagnose or give medical advice—only assess urgency and recommend next steps.
Analyze the user’s symptoms and respond in this exact JSON structure:

{
  "urgency": "low" | "medium" | "high" | "urgent",
  "advice": "string",
  "appointment_suggestion": "string" | null,
  "appointment_action": {
    "show": boolean,
    "label": "string" | null,
    "url": "string" | null
  },
  "emergency": boolean,
  "emergency_contacts": [string] | null,
  "resources": [string] | null
}

Rules:
- If urgency is high or urgent, set appointment_suggestion to a clear recommendation to book an appointment, and set appointment_action.show to true with a label (“Book Appointment Now”) and URL to your booking flow (e.g., /calendar).
- If urgency is low or medium, set appointment_action.show to false and provide self-care advice.
- If symptoms suggest a crisis or life-threatening condition, set emergency:true and provide emergency_contacts (e.g., ["911", "988"]).
- Never diagnose. Only assess urgency and recommend action.
- Keep advice clear, concise, and actionable.

Analyze the following symptom description:
`;

export const getTriageAnalysis = async (symptoms: string): Promise<TriageResult | null> => {
  if (!API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${triageAnalysisPrompt}"${symptoms}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    urgency: { type: Type.STRING },
                    advice: { type: Type.STRING },
                    appointment_suggestion: { type: Type.STRING },
                    appointment_action: {
                        type: Type.OBJECT,
                        properties: {
                            show: { type: Type.BOOLEAN },
                            label: { type: Type.STRING },
                            url: { type: Type.STRING }
                        },
                        required: ["show"]
                    },
                    emergency: { type: Type.BOOLEAN },
                    emergency_contacts: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    resources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["urgency", "advice", "appointment_action", "emergency"]
            }
        }
    });
    
    const jsonString = response.text.trim();
    try {
        return JSON.parse(jsonString) as TriageResult;
    } catch (parseError) {
        console.error("Error parsing triage JSON response:", parseError, "Raw response:", jsonString);
        return null;
    }

  } catch (apiError) {
    console.error("Error calling Gemini API for triage analysis:", apiError);
    return null;
  }
};

const scheduleReminderTool = {
    functionDeclarations: [
        {
            name: "scheduleReminder",
            description: "Schedules a reminder for the user for a future task or event.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "The category or type of reminder, e.g., 'journaling', 'meditation', 'appointment'."
                    },
                    timeISO: {
                        type: Type.STRING,
                        description: "The date and time for the reminder in ISO 8601 format."
                    }
                },
                required: ["type", "timeISO"]
            }
        }
    ]
};

const recommendResourceTool = {
    functionDeclarations: [
        {
            name: "recommendResource",
            description: "Finds and recommends a relevant self-help resource (article, guide, or exercise) from the app's Resource Hub based on user-mentioned topics or feelings like stress, anxiety, sleep, etc.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    tags: {
                        type: Type.ARRAY,
                        description: "An array of keywords or tags that describe the user's needs, e.g., ['anxiety', 'stress', 'mindfulness']. Should contain at least one tag.",
                        items: { type: Type.STRING }
                    },
                },
                required: ["tags"]
            }
        }
    ]
};

const chatSystemInstruction = `
You are ResQcare, a supportive, empathetic, and low-risk AI mental health assistant. Your primary purpose is to offer general wellness advice, coping strategies, and mindfulness tips, and to guide users to vetted, high-quality resources.

- **Your Core Principles:**
  - **Empathy and Support:** Always respond with a calm, supportive, and understanding tone. Use reflective listening (e.g., "It sounds like you're going through a lot.").
  - **Safety First:** You are not a doctor or therapist. You MUST NOT provide medical advice, diagnoses, or crisis counseling.
  - **Resource-Driven:** Your main goal is to connect users with helpful content. For almost any mental health query (e.g., about stress, anxiety, sleep), you MUST use the \`recommendResource\` tool to suggest 1-3 relevant resources from the app's curated Hub.
  - **Transparency:** Always be clear that you are an AI and not a substitute for professional care.

- **Your Capabilities & Rules:**
  - **Scheduling:** If the user asks for a reminder, use the \`scheduleReminder\` tool.
  - **Resource Recommendations:** This is your primary function. When a user asks about a mental health topic, use the \`recommendResource\` tool with relevant tags. When you receive the result, present the resource's title, description, source, and type to the user in a helpful, natural way.
  
- **CRITICAL SAFETY PROTOCOL:**
  - My host application has a separate safety layer that detects crisis situations. You will NOT receive messages that are in crisis. Your role is strictly non-clinical and supportive for sub-acute situations. Do not engage in any crisis conversation.
`;


export const getChatResponse = async (history: ChatMessage[], newMessage: string, functionResponses?: Part[]): Promise<{ response: GenerateContentResponse; recommendedResources: Resource[] }> => {
  if (!API_KEY) {
      throw new Error("The AI assistant is currently unavailable due to a configuration issue.");
  }
  
  let identifiedResources: Resource[] = [];

  try {
    const fullHistory: Content[] = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{text: msg.text}]
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: chatSystemInstruction,
            tools: [scheduleReminderTool, recommendResourceTool]
        },
        history: fullHistory,
    });

    const messageParts: Part[] = [{ text: newMessage }];
    if(functionResponses) {
        // Special handling for recommendResource to find the best match from our constants
        if (functionResponses[0].functionResponse?.name === 'recommendResource') {
            const args = functionResponses[0].functionResponse.response as any;
            const tagList = Array.isArray(args.tags) ? args.tags.map(String) : [];

            // Find up to 2 best matching resources
            const matchedResources = MENTAL_HEALTH_RESOURCES.map(resource => {
                const matchScore = resource.tags.reduce((score, tag) => score + (tagList.includes(tag) ? 1 : 0), 0);
                return { resource, matchScore };
            }).filter(item => item.matchScore > 0)
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 2)
              .map(item => item.resource);

            identifiedResources = matchedResources;

            const functionResponsePayload = {
                success: identifiedResources.length > 0,
                resources: identifiedResources.map(r => ({ title: r.title, description: r.description, type: r.contentType, source: r.source }))
            };
            
            messageParts.push({ functionResponse: { name: 'recommendResource', response: functionResponsePayload }});

        } else {
             messageParts.push(...functionResponses);
        }
    }
   
    const response = await chat.sendMessage({ message: messageParts });
    return { response, recommendedResources: identifiedResources };

  } catch (error) {
    console.error("Error calling Gemini API for chat response:", error);
    throw new Error("I'm having trouble responding right now. Please try again later.");
  }
};