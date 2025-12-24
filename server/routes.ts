import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSwmmModelSchema } from "@shared/schema";
import { analyzeRainfall, analyzeRunoff, analyzeDischarge } from "./swmm-parser";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/models", async (req, res) => {
    try {
      const parsed = insertSwmmModelSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid model data", details: parsed.error });
      }
      
      const model = await storage.createSwmmModel(parsed.data);
      res.json(model);
    } catch (error) {
      console.error("Error creating model:", error);
      res.status(500).json({ error: "Failed to create model" });
    }
  });
  
  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getAllSwmmModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });
  
  app.get("/api/models/:id", async (req, res) => {
    try {
      const model = await storage.getSwmmModel(req.params.id);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      console.error("Error fetching model:", error);
      res.status(500).json({ error: "Failed to fetch model" });
    }
  });
  
  app.delete("/api/models/:id", async (req, res) => {
    try {
      await storage.deleteSwmmModel(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting model:", error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });
  
  app.post("/api/analyze/rainfall/:modelId", async (req, res) => {
    try {
      const model = await storage.getSwmmModel(req.params.modelId);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      
      const results = analyzeRainfall(model.content);
      
      await storage.createAnalysisResult({
        modelId: model.id,
        toolType: "rainfall",
        results,
      });
      
      res.json(results);
    } catch (error) {
      console.error("Error analyzing rainfall:", error);
      res.status(500).json({ error: "Failed to analyze rainfall data" });
    }
  });
  
  app.post("/api/analyze/runoff/:modelId", async (req, res) => {
    try {
      const model = await storage.getSwmmModel(req.params.modelId);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      
      const results = analyzeRunoff(model.content);
      
      await storage.createAnalysisResult({
        modelId: model.id,
        toolType: "runoff",
        results,
      });
      
      res.json(results);
    } catch (error) {
      console.error("Error analyzing runoff:", error);
      res.status(500).json({ error: "Failed to analyze runoff data" });
    }
  });
  
  app.post("/api/analyze/discharge/:modelId", async (req, res) => {
    try {
      const model = await storage.getSwmmModel(req.params.modelId);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      
      const results = analyzeDischarge(model.content);
      
      await storage.createAnalysisResult({
        modelId: model.id,
        toolType: "discharge",
        results,
      });
      
      res.json(results);
    } catch (error) {
      console.error("Error analyzing discharge:", error);
      res.status(500).json({ error: "Failed to analyze discharge data" });
    }
  });
  
  app.get("/api/results/:modelId", async (req, res) => {
    try {
      const results = await storage.getAnalysisResults(req.params.modelId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  return httpServer;
}
