// src/services/groqAPI.ts
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("VITE_GROQ_API_KEY is not set in your .env.local file");
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // This is required for client-side calls
});

// Define and export the shape of a flashcard
export interface Flashcard {
  term: string;
  definition: string;
}

export const generateStudyGuide = async (courseName: string, courseContent: string): Promise<string> => {
  console.log("Sending request to Groq API for study guide...");

  const chatCompletion = await groq.chat.completions.create({
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

  const content = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a study guide at this time.";
  console.log("Received response from Groq API.");
  return content;
};

// New function for generating flashcards with robust parsing
export const generateFlashcards = async (courseName: string, courseContent: string): Promise<Flashcard[]> => {
  console.log("Sending request to Groq API for flashcards...");

  const chatCompletion = await groq.chat.completions.create({
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
    if (!content) {
      throw new Error("No content received from Groq API.");
    }
    
    const jsonResponse = JSON.parse(content);
    
    // --- THIS IS THE IMPROVED PARSING LOGIC ---
    let flashcardsArray: any[] | undefined;

    if (Array.isArray(jsonResponse)) {
      // Case 1: The entire response is an array
      flashcardsArray = jsonResponse;
    } else if (typeof jsonResponse === 'object' && jsonResponse !== null) {
      // Case 2: The response is an object, find the first key that holds an array
      flashcardsArray = Object.values(jsonResponse).find(Array.isArray) as any[] | undefined;
    }

    if (!flashcardsArray) {
        console.error("Parsed JSON does not contain an array:", jsonResponse);
        throw new Error("AI response did not contain a valid flashcard array.");
    }
    
    // Validate the structure of each item in the array to ensure they match our Flashcard type
    const validatedFlashcards = flashcardsArray.filter(
        (item: any): item is Flashcard => 
            item && typeof item.term === 'string' && typeof item.definition === 'string'
    );

    console.log("Received and successfully parsed flashcards from Groq API.");
    return validatedFlashcards;
  } catch (error) {
    console.error("Error parsing flashcards JSON from Groq:", error);
    // Re-throw a more user-friendly error
    throw new Error("The AI returned an invalid format for flashcards.");
  }
};