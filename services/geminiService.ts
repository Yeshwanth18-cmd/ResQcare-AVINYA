import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage, TriageResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const triageAnalysisPrompt = `
You are an AI medical triage assistant. Your role is to analyze a patient's symptoms and classify the urgency based on standard medical triage protocols. You must not provide a diagnosis. Your response MUST be a JSON object with the following structure:
{
  "urgency": "Emergency" | "Urgent" | "Routine" | "Self-Care",
  "suggestedPathway": string, // A brief, clear recommended next step (e.g., "Go to the Emergency Department immediately", "Schedule a visit with a doctor within 24-48 hours", "Monitor symptoms and follow up if they worsen", "Rest and drink fluids").
  "reasoning": string, // A concise explanation for your classification, mentioning key symptoms.
  "riskScore": number // A score from 1 (low risk) to 10 (high risk).
}

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
                    urgency: { type: Type.STRING, enum: ["Emergency", "Urgent", "Routine", "Self-Care"] },
                    suggestedPathway: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    riskScore: { type: Type.NUMBER }
                },
                required: ["urgency", "suggestedPathway", "reasoning", "riskScore"]
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

const chatSystemInstruction = `
You are ResQcare, a friendly, empathetic, and supportive AI health assistant. Your goal is to provide helpful information and support.

- Use a calm, supportive, and clear tone.
- Keep your responses concise and easy to understand.
- Do not provide medical advice, diagnoses, or therapy. You are not a substitute for a real doctor.
- Always include a reminder in your footer that you are an AI and not a substitute for professional medical help.
- If the user describes symptoms that sound serious or urgent, gently guide them to use the "Symptom Checker & Triage" feature on the dashboard or to contact emergency services.
- This is a critical safety instruction: If the user expresses thoughts of self-harm or harming others, immediately respond with a message to seek professional help and provide a crisis hotline number.
`;

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!API_KEY) {
      throw new Error("The AI assistant is currently unavailable due to a configuration issue.");
  }
  
  try {
     const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: chatSystemInstruction,
      },
      history: history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{text: msg.text}]
      }))
    });
    
    const response = await chat.sendMessage({ message: newMessage });

    return response.text + "\n\n---\n*I'm an AI assistant. For professional medical advice, please consult a healthcare provider.*";

  } catch (error) {
    console.error("Error calling Gemini API for chat response:", error);
    throw new Error("I'm having trouble connecting to my services right now. Please try again in a moment.");
  }
};