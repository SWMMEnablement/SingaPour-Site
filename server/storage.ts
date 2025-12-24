import { 
  users, swmmModels, analysisResults,
  type User, type InsertUser,
  type SwmmModel, type InsertSwmmModel,
  type AnalysisResult, type InsertAnalysisResult
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSwmmModel(model: InsertSwmmModel): Promise<SwmmModel>;
  getSwmmModel(id: string): Promise<SwmmModel | undefined>;
  getAllSwmmModels(): Promise<SwmmModel[]>;
  deleteSwmmModel(id: string): Promise<void>;
  
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResults(modelId: string): Promise<AnalysisResult[]>;
  getLatestAnalysisResult(modelId: string, toolType: string): Promise<AnalysisResult | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createSwmmModel(model: InsertSwmmModel): Promise<SwmmModel> {
    const [result] = await db.insert(swmmModels).values(model).returning();
    return result;
  }

  async getSwmmModel(id: string): Promise<SwmmModel | undefined> {
    const [model] = await db.select().from(swmmModels).where(eq(swmmModels.id, id));
    return model || undefined;
  }

  async getAllSwmmModels(): Promise<SwmmModel[]> {
    return await db.select().from(swmmModels).orderBy(desc(swmmModels.createdAt));
  }

  async deleteSwmmModel(id: string): Promise<void> {
    await db.delete(swmmModels).where(eq(swmmModels.id, id));
  }

  async createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult> {
    const [analysisResult] = await db.insert(analysisResults).values(result).returning();
    return analysisResult;
  }

  async getAnalysisResults(modelId: string): Promise<AnalysisResult[]> {
    return await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.modelId, modelId))
      .orderBy(desc(analysisResults.createdAt));
  }

  async getLatestAnalysisResult(modelId: string, toolType: string): Promise<AnalysisResult | undefined> {
    const results = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.modelId, modelId))
      .orderBy(desc(analysisResults.createdAt));
    
    const filtered = results.filter(r => r.toolType === toolType);
    return filtered[0] || undefined;
  }
}

export const storage = new DatabaseStorage();
