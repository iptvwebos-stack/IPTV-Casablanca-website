import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      } catch (err) {
        console.error("Error initializing GoogleGenAI client:", err);
      }
    }
  }
  return aiClient;
}

// System instructions for the IPTV Casablanca AI Support Agent
const SYSTEM_INSTRUCTION = `Vous êtes "Youssef", conseiller de support client chez "IPTV Casablanca".

Règles ABSOLUES de comportement et communication :
1. Vos réponses doivent être TRÈS directes, courtes et naturelles (style conversationnel parlé spontané, pas de blabla inutile, maximum 1 ou 2 courtes phrases).
2. Nous proposons UNE SEULE ET UNIQUE offre d'abonnement : 12 mois pour 250 DH (ou 25€). Nous n'avons AUCUN autre forfait (pas d'offre 3 mois, 6 mois ou 24 mois). Si on vous demande le prix, dites simplement : "C'est 250 DH pour l'abonnement de 12 mois. C'est notre unique formule."
3. Soyez spontané et amical. Si l'utilisateur parle en Darija (arabe marocain), répondez-lui de la même manière très courte et naturelle.
4. Pour l'installation, donnez une réponse ultra-rapide ou renvoyez-les vers WhatsApp.
5. Invitez-les à passer commande ou demander un test gratuit sur WhatsApp d'un simple clic.`;

// API endpoint for support chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    // Fallback support logic if API key is not configured yet
    if (!ai) {
      console.log("Gemini API key not configured. Using high-quality offline support assistant fallback.");
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let responseText = "Salut ! Je suis Youssef. Comment puis-je t'aider ?\n";

      if (lastUserMsg.includes("prix") || lastUserMsg.includes("tarif") || lastUserMsg.includes("combien") || lastUserMsg.includes("abonnement") || lastUserMsg.includes("offre")) {
        responseText = "On a une seule offre : 12 mois pour 250 DH seulement. C'est l'unique formule !";
      } else if (lastUserMsg.includes("test") || lastUserMsg.includes("gratuit") || lastUserMsg.includes("essai")) {
        responseText = "Oui, on propose un test gratuit d'une heure. Contacte-nous directement sur WhatsApp pour l'activer !";
      } else if (lastUserMsg.includes("tv") || lastUserMsg.includes("smart") || lastUserMsg.includes("smarters") || lastUserMsg.includes("installer") || lastUserMsg.includes("application") || lastUserMsg.includes("android") || lastUserMsg.includes("firestick")) {
        responseText = "On est compatible avec tous les appareils (Smart TV, Android, Firestick). Viens sur WhatsApp et on t'installe ça en 2 minutes !";
      } else {
        responseText = "Dis-moi ce qu'il te faut ou contacte-nous directement sur WhatsApp pour faire simple !";
      }

      return res.json({ text: responseText });
    }

    // Map history to Google GenAI schema format
    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
      return {
        role: role as "user" | "model",
        parts: [{ text: m.content }],
      };
    });

    // Call Gemini API using modern SDK
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Désolé, je rencontre une petite difficulté pour formuler ma réponse. Pouvez-vous répéter ou nous contacter par WhatsApp ?";
    return res.json({ text: responseText });

  } catch (error: any) {
    console.error("Error in /api/chat endpoint:", error);
    return res.status(500).json({ error: "Désolé, une erreur interne est survenue. Veuillez réessayer." });
  }
});

// Serve Vite dev server middleware in development, and static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
