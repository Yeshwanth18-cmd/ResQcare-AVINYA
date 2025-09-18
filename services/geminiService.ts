import { GoogleGenAI, Type, Part, GenerateContentResponse, Content } from "@google/genai";
import type { ChatMessage, SymptomAnalysisResult, SafetyAnalysisResult, Resource, Hospital, AppointmentOptionsResult, BookingConfirmation } from '../types';
import { MENTAL_HEALTH_RESOURCES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Helper to escape strings for safe inclusion in JSON within prompts
const escapeStringForJson = (str: string): string => {
  return JSON.stringify(str).slice(1, -1); // stringify adds quotes, so we slice them off
};


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

const getSymptomAnalysisPrompt = (symptoms: string, location: { lat: number; lon: number; }) => `
You are a senior healthcare UX architect and AI engineer for a professional medical app.
Your role is to analyze user symptoms with empathy and clarity, providing actionable next steps. You NEVER provide a diagnosis.

**Core Rules:**
1.  **Analyze Symptoms First**: Always provide a symptom analysis including \`possible_causes\` (do not frame as a diagnosis), \`urgency\` level, \`self_care_advice\`, and relevant \`resources\`.
2.  **Determine Urgency**: Classify urgency into one of four levels: "low", "medium", "high", or "urgent".
3.  **Conditional Hospital Logic**:
    - If urgency is "high" or "urgent", you MUST provide a list of 1-3 nearby, highly-rated (>=3.5) hospitals. Use the user's location (lat: ${location.lat}, lon: ${location.lon}) to generate realistic hospital data. Order them by distance. If none are realistically nearby, find the single nearest highly-rated one. Set the \`hospitals\` key to this array.
    - If urgency is "low" or "medium", you MUST set the \`hospitals\` key to \`null\`.
4.  **Emergency Detection**:
    - If symptoms strongly suggest a life-threatening emergency (e.g., severe chest pain, difficulty breathing, stroke signs), you MUST set \`emergency\` to \`true\` and provide a list of contacts in \`emergency_contacts\` (e.g., ["911", "112"]).
    - Otherwise, set \`emergency\` to \`false\` and \`emergency_contacts\` to \`null\`.
5.  **Generate Messages**:
    - For low/medium urgency: "Here’s what your symptoms might mean and how to care for yourself."
    - For high/urgent urgency: "Based on your symptoms, it’s important to see a healthcare provider. Here are nearby hospitals."
6.  **Data Generation for Hospitals**: For each hospital, you MUST provide:
    - A realistic \`name\`.
    - Its exact \`lat\` and \`lon\`.
    - A full, realistic \`address\`.
    - \`distance_km\` from the user.
    - \`rating\` between 3.5 and 5.0.
    - Relevant \`services\`.
    - \`booking_url\` set to '/calendar'.
    - A \`directions_url\` using 'https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination={hospital.lat},{hospital.lon}'.
    - A \`marker_color\`. Rule: If services include 'Emergency', set to '#ef4444'. Otherwise, set to '#3b82f6'.

**JSON Output Structure:**
Your response MUST be a single, valid JSON object matching this exact structure. Do not add any extra text or explanations.

{
  "symptom_analysis": {
    "possible_causes": ["string"],
    "urgency": "low" | "medium" | "high" | "urgent",
    "self_care_advice": "string",
    "resources": ["string"]
  },
  "hospitals": [ { "name": "string", "lat": number, "lon": number, "address": "string", "distance_km": number, "rating": number, "services": ["string"], "booking_url": "string", "directions_url": "string", "marker_color": "string" } ] | null,
  "emergency": boolean,
  "emergency_contacts": ["string"] | null,
  "message": "string",
  "ui": { "theme": "medical_clean", "primary": "#2a8bf2", "secondary": "#e6f7ff", "text": "#111111", "background": "#ffffff" }
}

**User's Symptoms**: "${symptoms}"

Generate the JSON response now.
`;


export const getSymptomAnalysis = async (symptoms: string, location: { lat: number, lon: number }): Promise<SymptomAnalysisResult | null> => {
  if (!API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getSymptomAnalysisPrompt(symptoms, location),
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    symptom_analysis: {
                        type: Type.OBJECT,
                        properties: {
                            possible_causes: { type: Type.ARRAY, items: { type: Type.STRING }},
                            urgency: { type: Type.STRING },
                            self_care_advice: { type: Type.STRING },
                            resources: { type: Type.ARRAY, items: { type: Type.STRING }},
                        },
                        required: ["possible_causes", "urgency", "self_care_advice", "resources"],
                    },
                    hospitals: {
                        type: Type.ARRAY,
                        nullable: true,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                lat: { type: Type.NUMBER },
                                lon: { type: Type.NUMBER },
                                address: { type: Type.STRING },
                                distance_km: { type: Type.NUMBER },
                                rating: { type: Type.NUMBER },
                                services: { type: Type.ARRAY, items: { type: Type.STRING } },
                                booking_url: { type: Type.STRING },
                                directions_url: { type: Type.STRING },
                                marker_color: { type: Type.STRING },
                            },
                            required: ["name", "lat", "lon", "address", "distance_km", "rating", "services", "booking_url", "directions_url", "marker_color"],
                        }
                    },
                    emergency: { type: Type.BOOLEAN },
                    emergency_contacts: { type: Type.ARRAY, nullable: true, items: { type: Type.STRING } },
                    message: { type: Type.STRING },
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
                required: ["symptom_analysis", "hospitals", "emergency", "emergency_contacts", "message", "ui"]
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

const getAppointmentOptionsPrompt = (hospital: Hospital) => `
You are a senior healthcare UX architect creating a real-time booking experience.
For the hospital provided below, generate a realistic set of appointment options.

**Hospital Details:**
${JSON.stringify(hospital, null, 2)}

**Rules:**
1.  Generate available slots for the next 3-5 business days.
2.  Provide 4-6 realistic time slots for each available day (e.g., 09:00, 10:30, 14:00).
3.  Ensure both 'in_person' and 'telehealth' options are available.
4.  Set 'requires_reason' and 'allows_attachments' to true.
5.  Create a welcoming message for the user.

**JSON Output Structure:**
Your response MUST be a single, valid JSON object matching this exact structure.

{
  "hospital": ${JSON.stringify(hospital)},
  "appointment_options": {
    "in_person": boolean,
    "telehealth": boolean,
    "available_slots": [ { "date": "YYYY-MM-DD", "times": ["HH:MM"] } ],
    "requires_reason": boolean,
    "allows_attachments": boolean
  },
  "ui": { "theme": "medical_clean", "primary": "#2a8bf2", "secondary": "#e6f7ff", "text": "#111111", "background": "#ffffff" },
  "message": "Select a time to book your appointment at ${escapeStringForJson(hospital.name)}."
}

Generate the JSON response now.
`;

export const getAppointmentOptions = async (hospital: Hospital): Promise<AppointmentOptionsResult | null> => {
  if (!API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getAppointmentOptionsPrompt(hospital),
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hospital: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, lat: { type: Type.NUMBER }, lon: { type: Type.NUMBER }, distance_km: { type: Type.NUMBER }, rating: { type: Type.NUMBER }, services: { type: Type.ARRAY, items: { type: Type.STRING } }, booking_url: { type: Type.STRING }, address: { type: Type.STRING }, directions_url: { type: Type.STRING }, marker_color: { type: Type.STRING } } },
                    appointment_options: {
                        type: Type.OBJECT,
                        properties: {
                            in_person: { type: Type.BOOLEAN },
                            telehealth: { type: Type.BOOLEAN },
                            available_slots: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, times: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
                            requires_reason: { type: Type.BOOLEAN },
                            allows_attachments: { type: Type.BOOLEAN }
                        },
                        required: ["in_person", "telehealth", "available_slots", "requires_reason", "allows_attachments"]
                    },
                    ui: { type: Type.OBJECT, properties: { theme: { type: Type.STRING }, primary: { type: Type.STRING }, secondary: { type: Type.STRING }, text: { type: Type.STRING }, background: { type: Type.STRING } } },
                    message: { type: Type.STRING }
                },
                required: ["hospital", "appointment_options", "ui", "message"]
            }
        }
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as AppointmentOptionsResult;
  } catch (error) {
    console.error("Error fetching appointment options:", error);
    return null;
  }
};

const confirmBookingPrompt = (hospital: Hospital, details: { date: string; time: string; type: string; reason: string; }) => `
You are a senior healthcare UX architect confirming an appointment.
A user has booked the following appointment:

- **Hospital:** ${hospital.name}
- **Date:** ${details.date}
- **Time:** ${details.time}
- **Type:** ${details.type}
- **Reason:** "${escapeStringForJson(details.reason)}"

**Task:**
Generate a booking confirmation JSON object.

**Rules:**
1.  Set \`status\` to "booked".
2.  Include the original hospital object.
3.  Create an \`appointment\` object with the provided details.
4.  Generate a unique \`id\`, a fake \`confirmation_url\`, and a fake \`calendar_url\`.
5.  Enable all reminders (email, sms, push).
6.  Write a reassuring confirmation message.

**JSON Output Structure:**
Your response MUST be a single, valid JSON object matching this exact structure.

{
  "status": "booked",
  "hospital": ${JSON.stringify(hospital)},
  "appointment": {
    "id": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "type": "in_person" | "telehealth",
    "reason": "string",
    "confirmation_url": "string",
    "calendar_url": "string",
    "reminder": { "email": boolean, "sms": boolean, "push": boolean }
  },
  "message": "Your appointment is confirmed! Details have been sent to your email."
}

Generate the JSON response now.
`;

export const confirmAppointmentBooking = async (hospital: Hospital, details: { date: string; time: string; type: string; reason: string; }): Promise<BookingConfirmation | null> => {
    if (!API_KEY) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: confirmBookingPrompt(hospital, details),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING },
                        hospital: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, lat: { type: Type.NUMBER }, lon: { type: Type.NUMBER }, distance_km: { type: Type.NUMBER }, rating: { type: Type.NUMBER }, services: { type: Type.ARRAY, items: { type: Type.STRING } }, booking_url: { type: Type.STRING }, address: { type: Type.STRING }, directions_url: { type: Type.STRING }, marker_color: { type: Type.STRING } } },
                        appointment: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                date: { type: Type.STRING },
                                time: { type: Type.STRING },
                                type: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                confirmation_url: { type: Type.STRING },
                                calendar_url: { type: Type.STRING },
                                reminder: { type: Type.OBJECT, properties: { email: { type: Type.BOOLEAN }, sms: { type: Type.BOOLEAN }, push: { type: Type.BOOLEAN } } }
                            },
                            required: ["id", "date", "time", "type", "reason", "confirmation_url", "calendar_url", "reminder"]
                        },
                        message: { type: Type.STRING }
                    },
                    required: ["status", "hospital", "appointment", "message"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as BookingConfirmation;
    } catch (error) {
        console.error("Error confirming appointment:", error);
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


const getTranslationPrompt = (texts: string[], targetLanguage: string, languageName: string) => `
You are an expert translator. Translate the following English texts to ${languageName}.
Your response MUST be a single, valid JSON object where keys are the original English strings and values are their translations. Do not include any other text or explanations. Do not add any newlines or formatting.

Example for target language "Spanish":
Input: ["Hello", "How are you?"]
Output:
{"Hello":"Hola","How are you?":"¿Cómo estás?"}

Translate these texts to ${languageName}:
${JSON.stringify(texts)}
`;

export const translateBatch = async (texts: string[], targetLanguage: string, languageName: string): Promise<Record<string, string>> => {
    if (!API_KEY || texts.length === 0) return {};
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getTranslationPrompt(texts, targetLanguage, languageName),
            config: {
                responseMimeType: "application/json",
            }
        });
        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
        }
        console.error("Unexpected translation response format:", parsed);
        return {};

    } catch (error) {
        console.error(`Error translating batch to ${targetLanguage}:`, error);
        return texts.reduce((acc, text) => {
            acc[text] = text;
            return acc;
        }, {} as Record<string, string>);
    }
};
