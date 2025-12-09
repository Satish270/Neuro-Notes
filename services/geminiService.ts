import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { DifficultyLevel, QuizQuestion, Flashcard } from "../types";

// Initialize the API client
// NOTE: We strictly use process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a comprehensive explanation of a topic based on difficulty level.
 */
export const generateExplanation = async (topic: string, level: DifficultyLevel): Promise<string> => {
  if (!topic) return "";
  
  try {
    const prompt = `
      You are an expert educator. Please explain the topic "${topic}" to a student at the "${level}" level.
      Structure your response with:
      1. A clear, concise summary.
      2. Key concepts (bullet points).
      3. A detailed breakdown.
      4. Real-world analogy or example.
      5. Further reading or related topics.
      Use Markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and knowledgeable study companion.",
      }
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw error;
  }
};

/**
 * Generates a quiz in JSON format.
 */
export const generateQuiz = async (topic: string, count: number = 5): Promise<QuizQuestion[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The quiz question text" },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "4 possible answers"
        },
        correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
        explanation: { type: Type.STRING, description: "Why this answer is correct" }
      },
      required: ["question", "options", "correctAnswerIndex", "explanation"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a ${count}-question multiple choice quiz about "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

/**
 * Generates flashcards in JSON format.
 */
export const generateFlashcards = async (topic: string, count: number = 8): Promise<Flashcard[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        front: { type: Type.STRING, description: "Term, concept, or question" },
        back: { type: Type.STRING, description: "Definition, answer, or explanation" },
        category: { type: Type.STRING, description: "Sub-category tag" }
      },
      required: ["front", "back"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create ${count} study flashcards for the topic "${topic}". Focus on key terms and definitions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as Flashcard[];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

/**
 * Creates a chat session for the Socratic Tutor.
 */
export const createTutorChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a Socratic Tutor. 
      Your goal is not just to give answers, but to guide the user to find the answer themselves through questioning.
      1. If the user asks a direct question, ask a guiding question back to help them reason through it.
      2. If the user is stuck, provide a hint, then another question.
      3. Be encouraging, patient, and concise. 
      4. If the user asks to "just tell me", you may summarize the answer but explain the "why" afterwards.`,
    }
  });
};