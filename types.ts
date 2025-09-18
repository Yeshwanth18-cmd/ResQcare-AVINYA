export interface Question {
  text: string;
  options: { text: string; value: number }[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  disclaimer: string;
  questions: Question[];
  scoring: { level: string; range: [number, number]; interpretation: string; }[];
  sourceInfo: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface Resource {
  title: string;
  description: string;
  type: 'article' | 'guide' | 'exercise';
  tags: string[];
  link: string;
}

export interface TriageResult {
  urgency: 'Emergency' | 'Urgent' | 'Routine' | 'Self-Care';
  suggestedPathway: string;
  reasoning: string;
  riskScore: number;
}