import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { upload } from './middleware/upload';
import path from 'path';
import express from 'express';
import fs from 'fs';
import { 
  insertPostSchema, 
  insertProjectSchema, 
  insertTechStackSchema, 
  insertInterestSchema, 
  insertActivitySchema, 
  insertProfileSchema,
  insertContactSchema,
  insertCommentSchema
} from "../shared/schema";

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
  
  apiRouter.post("/posts", upload.fields([
    { name: 'md', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]), async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let mdFile: Express.Multer.File | null = null;
    let imageFile: Express.Multer.File | null = null;
    
    try {
      if (!files.md || !files.md[0]) {
        throw new Error("请上传 Markdown 文件");
      }

      mdFile = files.md[0];
      imageFile = files.image?.[0] || null;
      
      // 验证文件类型
      if (!mdFile.originalname.toLowerCase().endsWith('.md')) {
        throw new Error("请上传 .md 格式的文件");
      }
      
      if (imageFile && !imageFile.mimetype.startsWith('image/')) {
        throw new Error("请上传有效的图片文件");
      }
      
      // 读取 Markdown 文件内容
      const content = fs.readFileSync(mdFile.path, 'utf-8');
      
      // 提取标题
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : mdFile.originalname.replace(/\.md$/, '');
      
      console.log("文章数据:", {
        title,
        contentLength: content.length,
        imageFile: imageFile ? imageFile.filename : 'none',
      });
      
      // 处理图片
      let imageUrl = null;
      if (imageFile) {
        imageUrl = `/uploads/${imageFile.filename}`;
      }
      
      try {
        // 创建博客文章数据对象
        const postData = {
          title,
          content,
          imageUrl,
          userId: 1 // 使用默认用户ID
        };
        
        console.log("发送到数据库的文章数据:", postData);
        
        // 验证数据
        const validatedData = insertPostSchema.parse(postData);
        
        // 创建博客文章
        const post = await storage.createPost(validatedData);
        
        // 删除临时的 Markdown 文件
        if (mdFile) {
          try {
            fs.unlinkSync(mdFile.path);
          } catch (err) {
            console.error('删除 Markdown 文件时出错:', err);
          }
        }
        
        res.status(201).json(post);
      } catch (dbError: any) {
        console.error('数据库错误:', dbError);
        
        if (dbError.errors && Array.isArray(dbError.errors)) {
          // Zod 验证错误
          const errorDetails = dbError.errors.map((e: any) => ({
            path: e.path,
            message: e.message
          }));
          throw new Error(`数据验证失败: ${JSON.stringify(errorDetails)}`);
        } else {
          throw new Error(`保存文章时发生错误: ${dbError.message || '未知错误'}`);
        }
      }
    } catch (error) {
      // 清理上传的文件
      if (mdFile) {
        try {
          fs.unlinkSync(mdFile.path);
        } catch (err) {
          console.error('删除 Markdown 文件时出错:', err);
        }
      }
      if (imageFile) {
        try {
          fs.unlinkSync(imageFile.path);
          // 如果图片已经保存到 uploads 目录，也需要删除
          if (imageFile.filename) {
            const imagePath = path.join(process.cwd(), 'uploads', imageFile.filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        } catch (err) {
          console.error('删除图片文件时出错:', err);
        }
      }
      
      console.error('创建文章时出错:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : '创建文章失败',
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });
  
  // Contact endpoints
  apiRouter.get("/contacts", async (_req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.get("/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContact(id);
      
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/contacts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.put("/contacts/:id/mark-as-read", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.markContactAsRead(id);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Comment endpoints
  apiRouter.get("/comments", async (_req: Request, res: Response) => {
    try {
      const comments = await storage.getComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.get("/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.post("/comments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  apiRouter.put("/comments/:id/approve", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const comment = await storage.approveComment(id);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // File upload endpoint
  apiRouter.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Register API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
