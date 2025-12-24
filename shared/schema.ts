import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const swmmModels = pgTable("swmm_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSwmmModelSchema = createInsertSchema(swmmModels).omit({
  id: true,
  createdAt: true,
});

export type InsertSwmmModel = z.infer<typeof insertSwmmModelSchema>;
export type SwmmModel = typeof swmmModels.$inferSelect;

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").references(() => swmmModels.id),
  toolType: text("tool_type").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

export interface RainfallData {
  timeseries: string[];
  values: number[];
  unit: string;
  totalDepth: number;
  peakIntensity: number;
  duration: number;
  gaps: { start: string; end: string }[];
  stormEvents: { start: string; end: string; depth: number }[];
}

export interface SubcatchmentData {
  name: string;
  area: number;
  imperv: number;
  width: number;
  slope: number;
  nImperv: number;
  nPerv: number;
  sImperv: number;
  sPerv: number;
  pctZero: number;
}

export interface RunoffResults {
  subcatchments: SubcatchmentData[];
  totalArea: number;
  avgImperv: number;
  infiltrationMethod: string;
}

export interface NodeData {
  name: string;
  type: string;
  invertElev: number;
  maxDepth: number;
  initDepth: number;
  surchargeDepth: number;
  pondedArea: number;
}

export interface ConduitData {
  name: string;
  fromNode: string;
  toNode: string;
  length: number;
  roughness: number;
  inOffset: number;
  outOffset: number;
  shape: string;
  geom1: number;
  geom2: number;
  capacity: number;
}

export interface DischargeResults {
  nodes: NodeData[];
  conduits: ConduitData[];
  totalNodes: number;
  totalConduits: number;
  surchargingNodes: string[];
  potentialFloodNodes: string[];
}
