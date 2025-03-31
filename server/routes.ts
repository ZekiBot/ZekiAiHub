import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";
import modelsRouter from "./api/models";
import { getUserBadges, updateBadgeProgress, earnBadge } from "./api/badges";

export async function registerRoutes(app: Express): Promise<Server> {
  // API rotalarını kaydet
  app.use("/api/models", modelsRouter);

  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Initialize HuggingFace
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);


  // OpenAI API routes
  app.post("/api/ai/openai/chat", async (req, res) => {
    try {
      const { messages, model = "gpt-4o", temperature = 0.7, maxTokens } = req.body;

      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      res.json({ content: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI chat error:", error);
      res.status(500).json({ message: "OpenAI API ile iletişim kurulamadı" });
    }
  });

  app.post("/api/ai/openai/image", async (req, res) => {
    try {
      const { prompt, n = 1, size = "1024x1024", responseFormat = "url" } = req.body;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n,
        size,
        response_format: responseFormat,
      });

      res.json({ url: response.data[0].url });
    } catch (error) {
      console.error("OpenAI image generation error:", error);
      res.status(500).json({ message: "Görsel oluşturulurken hata oluştu" });
    }
  });

  // HuggingFace API routes
  app.post("/api/ai/huggingface/text", async (req, res) => {
    try {
      const { prompt, model = "gpt2", maxTokens = 100, temperature = 0.7 } = req.body;

      const response = await hf.textGeneration({
        model,
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
        },
      });

      res.json({ text: response.generated_text });
    } catch (error) {
      console.error("HuggingFace text generation error:", error);
      res.status(500).json({ message: "Metin oluşturulurken hata oluştu" });
    }
  });

  app.post("/api/ai/huggingface/image-classification", async (req, res) => {
    try {
      const { imageUrl, model = "google/vit-base-patch16-224" } = req.body;

      const response = await hf.imageClassification({
        model,
        data: await fetch(imageUrl).then(r => r.blob()),
      });

      res.json({ classifications: response });
    } catch (error) {
      console.error("HuggingFace image classification error:", error);
      res.status(500).json({ message: "Görsel sınıflandırılırken hata oluştu" });
    }
  });

  app.post("/api/ai/huggingface/translation", async (req, res) => {
    try {
      const { text, model = "Helsinki-NLP/opus-mt-en-tr" } = req.body;

      const response = await hf.translation({
        model,
        inputs: text,
      });

      res.json({ translation: response.translation_text });
    } catch (error) {
      console.error("HuggingFace translation error:", error);
      res.status(500).json({ message: "Çeviri yapılırken hata oluştu" });
    }
  });

  app.post("/api/ai/huggingface/summarization", async (req, res) => {
    try {
      const { text, model = "facebook/bart-large-cnn" } = req.body;

      const response = await hf.summarization({
        model,
        inputs: text,
        parameters: {
          max_length: 100,
        },
      });

      res.json({ summary: response.summary_text });
    } catch (error) {
      console.error("HuggingFace summarization error:", error);
      res.status(500).json({ message: "Özetleme yapılırken hata oluştu" });
    }
  });

  // Model routes
  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error) {
      console.error("Get models error:", error);
      res.status(500).json({ message: "Modeller alınırken hata oluştu" });
    }
  });

  app.get("/api/models/:id", async (req, res) => {
    try {
      const model = await storage.getModel(parseInt(req.params.id));

      if (!model) {
        return res.status(404).json({ message: "Model bulunamadı" });
      }

      res.json(model);
    } catch (error) {
      console.error("Get model error:", error);
      res.status(500).json({ message: "Model alınırken hata oluştu" });
    }
  });

  // Firebase kimlik doğrulama kontrol aracı
  const firebaseAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Kimlik doğrulama başarısız: Token bulunamadı" });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: "Kimlik doğrulama başarısız: Token geçersiz" });
    }

    try {
      // Not: Burada gerçek bir Firebase token doğrulaması yapılacak
      // Şu an için API anahtarları eklemediğimizden sadece varlık kontrolü yapıyoruz
      req.user = { id: 'temp-user-id' }; // Geçici kullanıcı ID'si
      next();
    } catch (error) {
      console.error("Token doğrulama hatası:", error);
      return res.status(401).json({ message: "Kimlik doğrulama başarısız: Token geçersiz" });
    }
  };

  // User favorites routes
  app.post("/api/favorites", firebaseAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { modelId } = req.body;

      const favorite = await storage.addFavorite(userId, parseInt(modelId));
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(500).json({ message: "Favorilere eklenirken hata oluştu" });
    }
  });

  app.get("/api/favorites", firebaseAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Get favorites error:", error);
      res.status(500).json({ message: "Favoriler alınırken hata oluştu" });
    }
  });

  app.delete("/api/favorites/:modelId", firebaseAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const modelId = parseInt(req.params.modelId);

      await storage.removeFavorite(userId, modelId);
      res.status(204).send();
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ message: "Favorilerden çıkarılırken hata oluştu" });
    }
  });

  // Rozet rotaları
  app.get("/api/users/:userId/badges", async (req, res) => {
    await getUserBadges(req, res);
  });

  app.post("/api/users/:userId/badges/progress", firebaseAuth, async (req, res) => {
    await updateBadgeProgress(req, res);
  });

  app.post("/api/users/:userId/badges/earn", firebaseAuth, async (req, res) => {
    await earnBadge(req, res);
  });

  const httpServer = createServer(app);

  return httpServer;
}