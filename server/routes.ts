import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPostSchema, insertProjectSchema, insertTechStackSchema, insertInterestSchema, insertActivitySchema, insertProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  const apiRouter = express.Router();
  
  // Profile endpoints
  apiRouter.get("/profile", async (_req: Request, res: Response) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/profile", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.put("/profile/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(id, validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Tech stack endpoints
  apiRouter.get("/tech-stacks", async (_req: Request, res: Response) => {
    try {
      const techStacks = await storage.getTechStacks();
      res.json(techStacks);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/tech-stacks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTechStackSchema.parse(req.body);
      const techStack = await storage.createTechStack(validatedData);
      res.status(201).json(techStack);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Interest endpoints
  apiRouter.get("/interests", async (_req: Request, res: Response) => {
    try {
      const interests = await storage.getInterests();
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/interests", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInterestSchema.parse(req.body);
      const interest = await storage.createInterest(validatedData);
      res.status(201).json(interest);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Project endpoints
  apiRouter.get("/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/projects", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Activity endpoints
  apiRouter.get("/activities", async (_req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/activities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Blog post endpoints
  apiRouter.get("/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.get("/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/posts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Register API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}

// Add missing import
import express from "express";
