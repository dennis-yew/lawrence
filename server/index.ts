import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';
import path from 'path';

// 确保上传目录存在
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Test database connection before starting server
  const { testConnection } = await import("./db");
  await testConnection();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('全局错误处理器捕获到错误:', err);
    
    const status = err.status || err.statusCode || 500;
    const message = err.message || "服务器内部错误";
    
    // 记录详细日志
    console.error('错误状态码:', status);
    console.error('错误消息:', message);
    if (err.stack) {
      console.error('错误堆栈:', err.stack);
    }
    
    // 如果是验证错误，提供更详细的信息
    if (err.name === 'ZodError' && err.errors) {
      return res.status(400).json({
        message: '数据验证失败',
        errors: err.errors
      });
    }
    
    res.status(status).json({ message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  try {
    server.listen(port, "127.0.0.1", () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    log(`Error starting server: ${error}`);
    process.exit(1);
  }
})();
