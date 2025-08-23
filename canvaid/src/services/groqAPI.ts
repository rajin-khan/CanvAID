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

export const generateStudyGuide = async (courseName: string, courseContent: string): Promise<string> => {
  console.log("Sending request to Groq API...");

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
    // As per the PRD, we'll use a powerful and fast model.
    // Llama 3 70b is a great choice.
    model: "llama3-70b-8192", 
  });

  const content = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a study guide at this time.";
  console.log("Received response from Groq API.");
  return content;
};