import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const checkApiKey = () => {
  if (!apiKey || apiKey === "") {
    throw new Error("MISSING_API_KEY: Please set GEMINI_API_KEY in your environment variables.");
  }
};

export const generateNewsSummary = async (content: string) => {
  try {
    checkApiKey();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following news article in about 2-3 sentences: \n\n${content}`,
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("MISSING_API_KEY")) throw error;
    throw new Error("AI service error. Please check your API key and quota.");
  }
};

export const improveNewsContent = async (content: string) => {
  try {
    checkApiKey();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Improve the following news article for a professional military mission website. Make it formal, clear, and concise: \n\n${content}`,
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("MISSING_API_KEY")) throw error;
    throw new Error("AI service error. Please check your API key and quota.");
  }
};

export const suggestNewsTitle = async (content: string) => {
  try {
    checkApiKey();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a professional and catchy title for the following news article: \n\n${content}`,
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("MISSING_API_KEY")) throw error;
    throw new Error("AI service error. Please check your API key and quota.");
  }
};

export const chatWithGemini = async (message: string, context: string) => {
  try {
    checkApiKey();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the ECOMIG Mission AI Assistant. Your goal is to help mission personnel with information about ECOMIG, its mandate, news, and policies. 
      
      Context information (latest news and mission details):
      ${context}
      
      User Question: ${message}`,
      config: {
        systemInstruction: "Be professional, helpful, and concise. Always maintain a military-appropriate tone. If you don't know the answer based on the context, say you're not sure and suggest contacting the PIO (Public Information Office).",
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("MISSING_API_KEY")) throw error;
    throw new Error("AI service error. Please check your API key and quota.");
  }
};
