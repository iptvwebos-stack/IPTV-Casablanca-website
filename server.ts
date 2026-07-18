import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import sharp from "sharp";
import fs from "fs/promises";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = 3000;

// En-têtes de sécurité HTTP (Helmet)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Protection contre les attaques (Rate Limiting)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes." },
  validate: false,
  keyGenerator: (req) => {
    return (req.headers["x-forwarded-for"] as string)?.split(',')[0] || (req.headers["forwarded"] as string) || req.ip || req.socket.remoteAddress || "unknown";
  }
});
app.use("/api/", apiLimiter);

// Middleware to parse JSON bodies
app.use(express.json({ limit: "1mb" }));

app.post("/api/verify-recaptcha", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, error: "Token manquant" });
  
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || "dummy_secret_key";
  if (secretKey === "dummy_secret_key") {
    // Mode démo si la clé n'est pas configurée
    return res.json({ success: true, score: 0.9 });
  }

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.success && data.score >= 0.5) {
      res.json({ success: true, score: data.score });
    } else {
      res.status(400).json({ success: false, error: "Score reCAPTCHA trop bas, activité suspecte." });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: "Erreur de validation reCAPTCHA." });
  }
});

// En-têtes de sécurité HTTP (Helmet)
app.use(helmet({
  contentSecurityPolicy: false, // On désactive CSP temporairement pour éviter de bloquer Vite ou les images externes
  crossOriginEmbedderPolicy: false
}));


// Middleware to parse JSON bodies (avec limite de taille)
app.use(express.json({ limit: "1mb" })); // Limite la taille pour protéger le serveur
// JSON Database Setup
const DATA_FILE = path.join(process.cwd(), "data.json");
let db: any = {
  orders: [],
  trials: [],
  contacts: [],
  settings: {
    whatsappNumber: "212698649074",
    annualPriceMAD: 250,
    adminPassword: "admin123"
  },
  mediaLinks: {
    "logo": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/logo.jpg",
    "banner": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/banner.png",
    "samsung": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/samsung.png",
    "lg": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/lg.png",
    "android": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/android.png",
    "satellite": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/satellite.png",
    "xciptvLogo": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-logo.png",
    "xciptvAccueil": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-acceuil.jpg",
    "xciptvIdentifiants": "https://raw.githubusercontent.com/iptvwebos-stack/IPTV-Casablanca-website/refs/heads/main/images/xciptv-identifiants.jpg"
  }
};

async function loadDb() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    db = JSON.parse(data);
  } catch (e) {
    await saveDb();
  }
}

async function saveDb() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Failed to save db:", e);
  }
}
loadDb();

app.get("/api/data", (req, res) => {
  res.json(db);
});

app.post("/api/data/orders", async (req, res) => {
  db.orders = req.body;
  await saveDb();
  res.json({ success: true });
});

app.post("/api/data/trials", async (req, res) => {
  db.trials = req.body;
  await saveDb();
  res.json({ success: true });
});

app.post("/api/data/contacts", async (req, res) => {
  db.contacts = req.body;
  await saveDb();
  res.json({ success: true });
});

app.post("/api/data/settings", async (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  await saveDb();
  res.json({ success: true });
});

app.post("/api/data/media", async (req, res) => {
  db.mediaLinks = { ...db.mediaLinks, ...req.body };
  await saveDb();
  res.json({ success: true });
});

// Set up Multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

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

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const currentPrice = db.settings.annualPriceMAD || 250;
    const SYSTEM_INSTRUCTION = `Vous êtes "Youssef", conseiller de support client chez "IPTV Casablanca".
Règles ABSOLUES de comportement et communication :
1. Vos réponses doivent être TRÈS directes, courtes et naturelles (style conversationnel parlé spontané, pas de blabla inutile, maximum 1 ou 2 courtes phrases).
2. Notre abonnement premium de 12 mois est à ${currentPrice} DH. Ne dites pas que c'est une formule unique ou la seule offre, donnez simplement le prix de l'abonnement annuel.
3. Soyez spontané et amical. Si l'utilisateur parle en Darija (arabe marocain), répondez-lui de la même manière très courte et naturelle.
4. Pour l'installation, donnez une réponse ultra-rapide ou renvoyez-les vers WhatsApp.
5. NE PROPOSEZ PAS de test gratuit de vous-même. SEULEMENT SI le client vous demande explicitement un test, dites-lui qu'il peut obtenir un test gratuit en nous contactant sur WhatsApp.`;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    const ai = getGeminiClient();
    
    if (!ai) {
      console.log("Gemini API key not configured. Using high-quality offline support assistant fallback.");
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let responseText = "Salut ! Je suis Youssef. Comment puis-je t'aider ?\n";
      
      if (lastUserMsg.includes("prix") || lastUserMsg.includes("tarif") || lastUserMsg.includes("combien") || lastUserMsg.includes("abonnement") || lastUserMsg.includes("offre")) {
        responseText = `L'abonnement premium de 12 mois est à ${currentPrice} DH.`;
      } else if (lastUserMsg.includes("test") || lastUserMsg.includes("gratuit") || lastUserMsg.includes("essai")) {
        responseText = "Oui, on propose un test gratuit d'une heure. Contacte-nous directement sur WhatsApp pour l'activer !";
      } else if (lastUserMsg.includes("tv") || lastUserMsg.includes("smart") || lastUserMsg.includes("smarters") || lastUserMsg.includes("installer") || lastUserMsg.includes("application") || lastUserMsg.includes("android") || lastUserMsg.includes("firestick")) {
        responseText = "On est compatible avec tous les appareils (Smart TV, Android, Firestick). Viens sur WhatsApp et on t'installe ça en 2 minutes !";
      } else {
        responseText = "Dis-moi ce qu'il te faut ou contacte-nous directement sur WhatsApp pour faire simple !";
      }
      return res.json({ text: responseText });
    }

    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
      return {
        role: role as "user" | "model",
        parts: [{ text: m.content }],
      };
    });

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

// MEDIA MANAGER BACKEND LOGIC
const MEDIA_TARGETS: Record<string, { width: number, height: number, filename: string, format: string }> = {
  "banner": { width: 1376, height: 768, filename: "banner.jpg", format: "jpeg" },
  "samsung": { width: 512, height: 512, filename: "samsung.png", format: "png" },
  "lg": { width: 512, height: 512, filename: "lg.png", format: "png" },
  "satellite": { width: 512, height: 512, filename: "satellite.png", format: "png" },
  "android": { width: 512, height: 512, filename: "android(1).png", format: "png" },
  "xciptv-page-accueil": { width: 2220, height: 1080, filename: "xciptv-page-accueil.jpg", format: "jpeg" },
  "xciptv-identifiants": { width: 512, height: 288, filename: "xciptv-identifiants.jpg", format: "jpeg" },
  "xciptv-logo-image": { width: 512, height: 288, filename: "XCIPTV Logo Image.png", format: "png" }
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
const DIST_DIR = path.join(process.cwd(), "dist");
const BACKUP_DIR = path.join(process.cwd(), "backups");

async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

async function getFileSize(filePath: string) {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

app.get("/api/media", async (req, res) => {
  try {
    const results = [];
    for (const [key, target] of Object.entries(MEDIA_TARGETS)) {
      const filePath = path.join(PUBLIC_DIR, target.filename);
      const size = await getFileSize(filePath);
      
      let actualWidth = target.width;
      let actualHeight = target.height;
      let actualFormat = target.format;
      
      if (size > 0) {
         try {
           const metadata = await sharp(filePath).metadata();
           actualWidth = metadata.width || target.width;
           actualHeight = metadata.height || target.height;
           actualFormat = (metadata.format || target.format).toUpperCase();
         } catch(e) {}
      }

      let backups = [];
      try {
        await ensureBackupDir();
        const files = await fs.readdir(BACKUP_DIR);
        backups = files
          .filter(f => f.startsWith(`${key}_`) && !f.startsWith(`temp_`))
          .sort((a, b) => b.localeCompare(a));
      } catch(e) {}

      results.push({
        logicalName: key,
        filename: target.filename,
        targetWidth: target.width,
        targetHeight: target.height,
        actualWidth,
        actualHeight,
        size,
        format: actualFormat,
        backups
      });
    }
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch media" });
  }
});

// PREVIEW API
app.post("/api/media/:logicalName/preview", upload.single("image"), async (req, res) => {
  try {
    const logicalName = req.params.logicalName;
    const target = MEDIA_TARGETS[logicalName];
    if (!target) return res.status(400).json({ error: "Unknown media" });
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    const outputFormat = req.body.outputFormat || 'original';
    const publicPath = path.join(PUBLIC_DIR, target.filename);
    
    let oldSize = await getFileSize(publicPath);
    let oldFormat = target.format.toUpperCase();
    if (oldSize > 0) {
      try {
        oldFormat = ((await sharp(publicPath).metadata()).format || target.format).toUpperCase();
      } catch (e) {}
    }

    let sharpInstance = sharp(req.file.buffer)
      .resize(target.width, target.height, { fit: 'cover', position: 'attention' })
      .withMetadata(false);

    const formatToUse = outputFormat === 'webp' ? 'webp' : (outputFormat === 'avif' ? 'avif' : target.format);
    
    if (formatToUse === 'jpeg' || formatToUse === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality: 85, mozjpeg: true });
    } else if (formatToUse === 'png') {
      sharpInstance = sharpInstance.png({ compressionLevel: 9, quality: 85 });
    } else if (formatToUse === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: 85, effort: 6 });
    } else if (formatToUse === 'avif') {
      sharpInstance = sharpInstance.avif({ quality: 70, effort: 6 });
    }

    const outputBuffer = await sharpInstance.toBuffer();
    const newSize = outputBuffer.length;
    
    await ensureBackupDir();
    const tempFilename = `temp_${logicalName}_${Date.now()}.tmp`;
    const tempPath = path.join(BACKUP_DIR, tempFilename);
    await fs.writeFile(tempPath, outputBuffer);

    // Get old image as base64 for preview
    let oldImageBase64 = null;
    try {
      const oldBuffer = await fs.readFile(publicPath);
      oldImageBase64 = `data:image/${oldFormat.toLowerCase()};base64,${oldBuffer.toString('base64')}`;
    } catch(e) {}
    
    const newImageBase64 = `data:image/${formatToUse};base64,${outputBuffer.toString('base64')}`;

    return res.json({
      success: true,
      tempFilename,
      oldSize,
      newSize,
      oldFormat,
      newFormat: formatToUse.toUpperCase(),
      reduction: oldSize > 0 ? Math.round(((oldSize - newSize) / oldSize) * 100) : 0,
      width: target.width,
      height: target.height,
      oldImageBase64,
      newImageBase64
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Preview failed: " + err.message });
  }
});

// CONFIRM API
app.post("/api/media/:logicalName/confirm", async (req, res) => {
  try {
    const logicalName = req.params.logicalName;
    const { tempFilename } = req.body;
    const target = MEDIA_TARGETS[logicalName];
    if (!target) return res.status(400).json({ error: "Unknown media" });
    if (!tempFilename) return res.status(400).json({ error: "No temp file" });

    const tempPath = path.join(BACKUP_DIR, tempFilename);
    const publicPath = path.join(PUBLIC_DIR, target.filename);
    const distPath = path.join(DIST_DIR, target.filename);

    const oldSize = await getFileSize(publicPath);
    if (oldSize > 0) {
      const backupPath = path.join(BACKUP_DIR, `${logicalName}_${Date.now()}_${target.filename}`);
      await fs.copyFile(publicPath, backupPath);
      
      const files = await fs.readdir(BACKUP_DIR);
      const logicalBackups = files.filter(f => f.startsWith(`${logicalName}_`) && !f.startsWith(`temp_`)).sort((a, b) => b.localeCompare(a));
      if (logicalBackups.length > 5) {
        for (let i = 5; i < logicalBackups.length; i++) {
          await fs.unlink(path.join(BACKUP_DIR, logicalBackups[i]));
        }
      }
    }

    await fs.copyFile(tempPath, publicPath);
    try {
      const distStat = await fs.stat(DIST_DIR);
      if (distStat.isDirectory()) {
        await fs.copyFile(tempPath, distPath);
      }
    } catch (e) {}

    await fs.unlink(tempPath);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Confirm failed" });
  }
});

// RESTORE API
app.post("/api/media/:logicalName/restore", async (req, res) => {
  try {
    const logicalName = req.params.logicalName;
    const { backupFilename } = req.body;
    const target = MEDIA_TARGETS[logicalName];
    
    if (!target) return res.status(400).json({ error: "Unknown media logical name" });
    if (!backupFilename) return res.status(400).json({ error: "No backup filename provided" });

    const backupPath = path.join(BACKUP_DIR, backupFilename);
    const publicPath = path.join(PUBLIC_DIR, target.filename);
    const distPath = path.join(DIST_DIR, target.filename);

    await fs.copyFile(backupPath, publicPath);
    
    try {
      const distStat = await fs.stat(DIST_DIR);
      if (distStat.isDirectory()) {
        await fs.copyFile(backupPath, distPath);
      }
    } catch (e) {}

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Restore failed: " + err.message });
  }
});

app.use('/backups', express.static(path.join(process.cwd(), 'backups')));

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
