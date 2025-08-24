// src/services/groqAPI.ts
import Groq from "groq-sdk";
import useCourseStore from "../store/courseStore";
import toast from "react-hot-toast";

export interface Flashcard {
  term: string;
  definition: string;
}

let groq: Groq | null = null;
let currentKey: string | null = null;

const getGroqClient = () => {
  const GROQ_API_KEY = useCourseStore.getState().apiKeys.groq;

  if (!GROQ_API_KEY) {
    toast.error("Groq API Key is missing. Please add it in Settings.");
    throw new Error("Groq API Key is not set.");
  }

  if (groq && currentKey === GROQ_API_KEY) {
    return groq;
  }

  currentKey = GROQ_API_KEY;
  groq = new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  return groq;
};

export const generateStudyGuide = async (courseName: string, courseContent: string): Promise<string> => {
  const client = getGroqClient();
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert academic assistant named CanvAID. Your purpose is to help students learn calmly and effectively. Your tone is encouraging, calm, and supportive. You will be given the name of a course and a structured list of its modules and materials. Your task is to generate a comprehensive, easy-to-understand study guide in Markdown format. Structure the guide with clear headings, bullet points, and highlight key concepts. Where appropriate, suggest potential exam questions based on the materials.`
      },
      {
        role: "user",
        content: `Please generate a study guide for the course "${courseName}". Here are the course materials:\n\n${courseContent}`,
      },
    ],
    model: "llama3-70b-8192", 
  });
  return chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a study guide.";
};

export const generateFlashcards = async (courseName: string, courseContent: string): Promise<Flashcard[]> => {
    const client = getGroqClient();
    const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert academic assistant specializing in identifying key concepts. You will be given course materials and your task is to extract the 10 most important terms and their definitions. Respond ONLY with a valid JSON that contains an array of objects, where each object has a "term" and a "definition" key. Do not include any other text, explanation, or markdown formatting. For example: { "flashcards": [ { "term": "Concept 1", "definition": "Definition 1" } ] }`
      },
      {
        role: "user",
        content: `Extract the 10 most important key concepts and their definitions from the materials for the course "${courseName}". Here are the materials:\n\n${courseContent}`,
      },
    ],
    model: "llama3-70b-8192",
    response_format: { type: "json_object" },
  });
    try {
        const content = chatCompletion.choices[0]?.message?.content;
        if (!content) throw new Error("No content from Groq.");
        const jsonResponse = JSON.parse(content);
        let flashcardsArray: any[] | undefined = Array.isArray(jsonResponse) ? jsonResponse : Object.values(jsonResponse).find(Array.isArray) as any[];
        if (!flashcardsArray) throw new Error("Invalid format.");
        return flashcardsArray.filter(item => item && typeof item.term === 'string' && typeof item.definition === 'string');
    } catch (error) {
        console.error("Error parsing flashcards JSON:", error);
        throw new Error("AI returned an invalid format for flashcards.");
    }
};