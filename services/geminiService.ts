import { GoogleGenAI, Type, Part, GenerateContentResponse, Content } from "@google/genai";
import type { ChatMessage, SymptomAnalysisResult, SafetyAnalysisResult, Resource } from '../types';
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


const getHospitalDiscoveryPrompt = (symptoms: string, location: { lat: number; lon: number; }) => `
You are a professional medical app's backend AI, specializing in real-time, location-powered hospital discovery.
Your task is to process user symptoms and their live GPS coordinates to suggest nearby, highly-rated hospitals.

**Rules:**
1.  **Live Location Only**: The provided location (lat: ${location.lat}, lon: ${location.lon}) is real-time. Use it for this query only.
2.  **Dynamic Radius Logic**: Your goal is to find 3-5 relevant hospitals.
    - Start with a small search radius (e.g., 2km).
    - If you find fewer than 3 hospitals with a rating of 3.5 or higher, expand your search radius incrementally (e.g., to 3km, then 4km, up to a max of 20km) until you find at least 3 hospitals.
    - The final \`radius_km\` in your response should be the radius you settled on.
3.  **Quality First**: Only consider hospitals with a rating of 3.5 or higher.
4.  **Order Results**: Order the filtered hospitals by rating (highest first), then by distance (closest first).
5.  **Fallback Logic**:
    - If your dynamic search finds hospitals, return up to 5 of them. Set \`action.show_nearest\` to \`false\` and \`action.out_of_range\` to \`false\`. Message: "Here are the top-rated hospitals near you. Tap to view details or book an appointment."
    - If, after expanding your search to the maximum reasonable radius, you still find NO hospitals, find the SINGLE NEAREST hospital with a rating of 3.5+, regardless of its distance. Set \`action.show_nearest\` to \`true\` and \`action.out_of_range\` to \`true\`. Message: "There are no highly rated hospitals within a reasonable distance from your location. Here’s the nearest recommended hospital—tap to view or book."
6.  **Data Generation**:
    - For each hospital, provide: a realistic name, its exact \`lat\` and \`lon\`, \`distance_km\` from the user, \`rating\` (3.5-5.0), relevant services, \`booking_url\` ('/calendar'), and a \`map_link\` using 'https://maps.google.com/?q={hospital.lat},{hospital.lon}'.

**JSON Output Structure:**
Your response MUST be a single, valid JSON object matching this exact structure. Do not add any extra text or explanations.

{
  "location": { "lat": ${location.lat}, "lon": ${location.lon}, "accuracy_m": 50, "source": "gps" },
  "radius_km": number,
  "hospitals": [ { "name": "string", "lat": number, "lon": number, "distance_km": number, "rating": number, "services": ["string"], "booking_url": "string", "map_link": "string" } ],
  "action": { "show_nearest": boolean, "out_of_range": boolean },
  "message": "string",
  "ui": { "theme": "medical_clean", "primary": "#2a8bf2", "secondary": "#e6f7ff", "text": "#111111", "background": "#ffffff" }
}

**User's Symptoms**: "${symptoms}"

Generate the JSON response now.
`;

export const getTriageAnalysis = async (symptoms: string, location: { lat: number, lon: number }): Promise<SymptomAnalysisResult | null> => {
  if (!API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getHospitalDiscoveryPrompt(symptoms, location),
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    location: {
                        type: Type.OBJECT,
                        properties: {
                            lat: { type: Type.NUMBER },
                            lon: { type: Type.NUMBER },
                            accuracy_m: { type: Type.NUMBER },
                            source: { type: Type.STRING },
                        },
                        required: ["lat", "lon", "accuracy_m", "source"],
                    },
                    radius_km: { type: Type.NUMBER },
                    hospitals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                lat: { type: Type.NUMBER },
                                lon: { type: Type.NUMBER },
                                distance_km: { type: Type.NUMBER },
                                rating: { type: Type.NUMBER },
                                services: { type: Type.ARRAY, items: { type: Type.STRING } },
                                booking_url: { type: Type.STRING },
                                map_link: { type: Type.STRING },
                            },
                            required: ["name", "lat", "lon", "distance_km", "rating", "services", "booking_url", "map_link"],
                        }
                    },
                    message: { type: Type.STRING },
                    action: {
                        type: Type.OBJECT,
                        properties: {
                            show_nearest: { type: Type.BOOLEAN },
                            out_of_range: { type: Type.BOOLEAN },
                        },
                        required: ["show_nearest", "out_of_range"],
                    },
                    ui: {
                        type: Type.OBJECT,
                        properties: {
                            theme: { type: Type.STRING },
                            primary: { type: Type.STRING },
                            secondary: { type: Type.STRING },
                            text: { type: Type.STRING },
                            background: { type: Type.STRING },
                        },
                        required: ["theme", "primary", "secondary", "text", "background"],
                    }
                },
                required: ["location", "radius_km", "hospitals", "message", "action", "ui"]
            }
        }
    });
    
    const jsonString = response.text.trim();
    try {
        return JSON.parse(jsonString) as SymptomAnalysisResult;
    } catch (parseError) {
        console.error("Error parsing discovery JSON response:", parseError, "Raw response:", jsonString);
        return null;
    }

  } catch (apiError) {
    console.error("Error calling Gemini API for discovery analysis:", apiError);
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