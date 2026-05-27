import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.error("[AI] Error: GEMINI_API_KEY is missing from environment variables.");
    throw new Error("GEMINI_API_KEY is missing from environment. Please go to Settings > Secrets and select your Gemini API Key.");
  }
  
  // Re-instantiate if needed to ensure we always use the latest key from env
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  console.log("Starting ECOMIG Tactical Server...");
  const apiKeyStatus = process.env.GEMINI_API_KEY ? `DETECTED (length: ${process.env.GEMINI_API_KEY.length})` : "MISSING";
  console.log(`[INIT] GEMINI_API_KEY: ${apiKeyStatus}`);
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    if (req.url !== '/api/health') {
      console.log(`${new Date().toISOString()} - [INCOMING] ${req.method} ${req.url}`);
    }
    next();
  });

  app.get("/api/health", (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
      service: "ECOMIG-CORE-BETA",
      aiStatus: hasKey ? "IDENTIFIED" : "NO_KEY_IN_ENV"
    });
  });

  // API routes
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage = "French" } = req.body;
      
      if (!text) {
        console.warn("[TRANSLATE] Missing text in request");
        return res.status(400).json({ error: "Text is required" });
      }

      console.log(`[TRANSLATE] Request: ${text.substring(0, 30)}... [Target: ${targetLanguage}]`);

      const ai = getAI();
      const prompt = `Translate the following text to ${targetLanguage}. Only provide the translation, nothing else, no conversational text, no explanations:\n\n${text}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const translatedText = response.text;

      if (!translatedText) {
        console.error("[TRANSLATE] Empty response from AI model");
        return res.status(500).json({ error: "No translation generated" });
      }

      console.log(`[TRANSLATE] Success: ${translatedText.substring(0, 30)}...`);
      res.json({ translatedText });
    } catch (error: any) {
      console.error("[TRANSLATE] Fatal Error:", error);
      const isMissingKey = error.message?.includes("API_KEY") || error.message?.includes("missing from environment");
      res.status(isMissingKey ? 503 : 500).json({ 
        error: isMissingKey ? "Translation service offline (API Key Missing)" : `Translation failed: ${error.message || 'Unknown AI error'}`
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAI();
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are the ECOMIG AI Assistant. You represent the ECOWAS Mission in The Gambia. You are helpful, professional, tactical, and knowledgeable about the mission's objectives (Securing Peace, Building Trust, Strengthening Democracy). Use military and professional tone where appropriate. Always prioritize regional stability and official mission information.",
        },
        history: history.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      });

      const response = await chat.sendMessage({ message });
      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Chat error:", error);
      const isMissingKey = error.message?.includes("API_KEY") || error.message?.includes("missing from environment");
      if (isMissingKey) {
        return res.json({ response: "AI system is offline (API Key missing). Please provide GEMINI_API_KEY in the environment settings." });
      }
      res.status(500).json({ error: "AI communication failed" });
    }
  });
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Correct catch-all for Express 5
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Tactical Core active on port ${PORT}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error("[FATAL] Server failed to start:", err);
  process.exit(1);
});
