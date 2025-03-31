import { users, models, userFavorites } from "@shared/schema";
import type { User, InsertUser, Model, InsertModel, UserFavorite, InsertUserFavorite } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Model operations
  getAllModels(): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  getModelsByCategory(category: string): Promise<Model[]>;
  createModel(model: InsertModel): Promise<Model>;
  updateModelUsageCount(id: number): Promise<void>;
  
  // User favorite operations
  getUserFavorites(userId: string): Promise<Model[]>;
  addFavorite(userId: string, modelId: number): Promise<UserFavorite>;
  removeFavorite(userId: string, modelId: number): Promise<void>;
  isFavorite(userId: string, modelId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private models: Map<number, Model>;
  private userFavorites: Map<string, UserFavorite>;
  modelCurrentId: number;
  favoriteCurrentId: number;

  constructor() {
    this.users = new Map();
    this.models = new Map();
    this.userFavorites = new Map();
    this.modelCurrentId = 1;
    this.favoriteCurrentId = 1;

    // Initialize with some sample data for models
    this.seedModels();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user: User = { ...insertUser, createdAt: now };
    this.users.set(user.id, user);
    return user;
  }

  // Model operations
  async getAllModels(): Promise<Model[]> {
    return Array.from(this.models.values());
  }

  async getModel(id: number): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async getModelsByCategory(category: string): Promise<Model[]> {
    return Array.from(this.models.values()).filter(
      (model) => model.category === category,
    );
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const id = this.modelCurrentId++;
    const model: Model = { ...insertModel, id, rating: 0, usageCount: 0 };
    this.models.set(id, model);
    return model;
  }

  async updateModelUsageCount(id: number): Promise<void> {
    const model = this.models.get(id);
    if (model) {
      model.usageCount += 1;
      this.models.set(id, model);
    }
  }

  // User favorite operations
  async getUserFavorites(userId: string): Promise<Model[]> {
    const favorites = Array.from(this.userFavorites.values()).filter(
      (favorite) => favorite.userId === userId,
    );
    
    return favorites.map((favorite) => {
      const model = this.models.get(favorite.modelId);
      if (!model) throw new Error(`Model not found: ${favorite.modelId}`);
      return model;
    });
  }

  async addFavorite(userId: string, modelId: number): Promise<UserFavorite> {
    const key = `${userId}-${modelId}`;
    
    // Check if already exists
    const existing = this.userFavorites.get(key);
    if (existing) return existing;
    
    const id = this.favoriteCurrentId++;
    const favorite: UserFavorite = { id, userId, modelId };
    this.userFavorites.set(key, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, modelId: number): Promise<void> {
    const key = `${userId}-${modelId}`;
    this.userFavorites.delete(key);
  }

  async isFavorite(userId: string, modelId: number): Promise<boolean> {
    const key = `${userId}-${modelId}`;
    return this.userFavorites.has(key);
  }

  // Seed some example models
  private seedModels() {
    const seedModels: InsertModel[] = [
      {
        name: "OpenAI GPT Türkçe",
        description: "Türkçe sohbet ve yaratıcı yazı desteği veren gelişmiş dil modeli.",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "chat",
        apiType: "gemini",
        modelId: "gemini-1.5-pro",
        isActive: true,
      },
      {
        name: "Stable Diffusion Türkçe",
        description: "Türkçe komutlarla çalışan, muhteşem görseller üreten AI modeli.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "visual",
        apiType: "huggingface",
        modelId: "stabilityai/stable-diffusion-2-1",
        isActive: true,
      },
      {
        name: "Code Helper Türkçe",
        description: "Türkçe açıklamalarla kod yazmanıza yardımcı olan yapay zeka.",
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "code",
        apiType: "gemini",
        modelId: "gemini-1.5-flash",
        isActive: true,
      },
      {
        name: "Matematik Çözücü",
        description: "Öğrenciler için adım adım matematik problemi çözücü.",
        imageUrl: "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "math",
        apiType: "gemini",
        modelId: "gemini-1.5-pro",
        isActive: true,
      },
      {
        name: "AI Oyun Arkadaşı",
        description: "Çocuklar için güvenli, eğitici ve eğlenceli oyun arkadaşı.",
        imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "game",
        apiType: "gemini",
        modelId: "gemini-1.5-flash",
        isActive: true,
      },
      {
        name: "Sesli Asistan",
        description: "Yaşlı kullanıcılar için kolay kullanımlı sesli yardımcı.",
        imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "chat",
        apiType: "gemini",
        modelId: "gemini-1.5-pro",
        isActive: true,
      },
      {
        name: "Türkçe-İngilizce Çevirmen",
        description: "Türkçe ve İngilizce arasında yüksek kaliteli çeviri yapan AI modeli.",
        imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "translation",
        apiType: "huggingface",
        modelId: "Helsinki-NLP/opus-mt-tr-en",
        isActive: true,
      },
      {
        name: "Türkçe Metin-Ses Dönüştürücü",
        description: "Türkçe metinleri doğal seslere dönüştüren gelişmiş yapay zeka.",
        imageUrl: "https://images.unsplash.com/photo-1567596388756-f6d710c8fc07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        category: "speech",
        apiType: "huggingface",
        modelId: "microsoft/speecht5_tts",
        isActive: true,
      },
    ];

    seedModels.forEach((model, index) => {
      const id = index + 1;
      const rating = 4 + Math.random(); // Random rating between 4.0 and 5.0
      const usageCount = Math.floor(Math.random() * 10000); // Random usage count
      
      this.models.set(id, {
        ...model,
        id,
        rating: parseFloat(rating.toFixed(1)),
        usageCount,
      });
      
      this.modelCurrentId = id + 1;
    });
  }
}

export const storage = new MemStorage();
