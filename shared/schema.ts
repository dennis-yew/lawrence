import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").notNull(),
});

export const insertPostSchema = createInsertSchema(posts)
  .pick({
    title: true,
    content: true,
    imageUrl: true,
    userId: true,
  })
  .refine(
    (data) => {
      // 确保必填字段存在
      return !!data.title && !!data.content && typeof data.userId === 'number';
    },
    {
      message: "标题和内容是必填字段，且用户ID必须是数字",
      path: ['title', 'content', 'userId']
    }
  );

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  iconBackground: text("icon_background").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  icon: true,
  iconBackground: true,
  userId: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const techStacks = pgTable("tech_stacks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  background: text("background").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertTechStackSchema = createInsertSchema(techStacks).pick({
  name: true,
  icon: true,
  background: true,
  userId: true,
});

export type InsertTechStack = z.infer<typeof insertTechStackSchema>;
export type TechStack = typeof techStacks.$inferSelect;

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertInterestSchema = createInsertSchema(interests).pick({
  name: true,
  description: true,
  icon: true,
  userId: true,
});

export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interests.$inferSelect;

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  count: integer("count").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  date: true,
  count: true,
  userId: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  alias: text("alias"),
  avatar: text("avatar"),
  github: text("github"),
  website: text("website"),
  personalityType: text("personality_type"),
  personalityTitle: text("personality_title"),
  userId: integer("user_id").notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  name: true,
  alias: true,
  avatar: true,
  github: true,
  website: true,
  personalityType: true,
  personalityTitle: true,
  userId: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  name: true,
  email: true,
  content: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
