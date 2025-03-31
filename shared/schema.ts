import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Firebase UID
  username: text("username").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  // Gamification fields
  badges: jsonb("badges").$type<{
    explorer: number,
    learner: number,
    master: number,
    collector: number,
    translator: number
  }>(),
  lastActive: timestamp("last_active"),
  accessibilitySettings: jsonb("accessibility_settings").$type<{
    mode: 'standard' | 'elderly' | 'children',
    fontSize: 'normal' | 'large' | 'extra-large',
    highContrast: boolean,
    simplifiedInterface: boolean
  }>(),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  apiType: text("api_type").notNull(), // openai, huggingface, etc.
  modelId: text("model_id").notNull(), // The actual model ID in the external API
  rating: integer("rating").default(0),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  // Extended fields for more detailed model information
  capabilities: jsonb("capabilities").$type<string[]>(),
  examples: jsonb("examples").$type<{prompt: string, response: string}[]>(),
  childFriendly: boolean("child_friendly").default(false),
  elderlyFriendly: boolean("elderly_friendly").default(false),
  complexity: text("complexity"), // 'simple', 'moderate', 'advanced'
});

export const userFavorites = pgTable(
  "user_favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    modelId: integer("model_id")
      .notNull()
      .references(() => models.id),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

export const modelUsageHistory = pgTable(
  "model_usage_history",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    modelId: integer("model_id")
      .notNull()
      .references(() => models.id),
    usedAt: timestamp("used_at").defaultNow(),
    prompt: text("prompt"),
    responseLength: integer("response_length"),
  }
);

export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    badgeType: text("badge_type").notNull(), // 'explorer', 'learner', etc.
    level: integer("level").notNull(),
    earnedAt: timestamp("earned_at").defaultNow(),
  }
);

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  fullName: true,
  avatar: true,
  badges: true,
  accessibilitySettings: true,
});

export const insertModelSchema = createInsertSchema(models).pick({
  name: true,
  description: true,
  imageUrl: true,
  category: true,
  apiType: true,
  modelId: true,
  isActive: true,
  capabilities: true,
  examples: true,
  childFriendly: true,
  elderlyFriendly: true,
  complexity: true,
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).pick({
  userId: true,
  modelId: true,
});

export const insertModelUsageHistorySchema = createInsertSchema(modelUsageHistory).pick({
  userId: true,
  modelId: true,
  prompt: true,
  responseLength: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeType: true,
  level: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = typeof models.$inferSelect;

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

export type InsertModelUsageHistory = z.infer<typeof insertModelUsageHistorySchema>;
export type ModelUsageHistory = typeof modelUsageHistory.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
