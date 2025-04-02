import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';
import path from 'path';

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
  console.log('正在启动服务器...');
  
  try {
    // 尝试测试数据库连接
    const { testConnection } = await import("./db");
    const connected = await testConnection();
    
    if (!connected) {
      console.warn('⚠️ 数据库连接测试失败，服务器可能只有部分功能可用');
    } else {
      console.log('✅ 数据库连接成功');
    }
  } catch (dbError) {
    console.error('❌ 数据库连接测试出错:', dbError);
    console.warn('⚠️ 继续启动服务器，但数据库功能可能不可用');
  }

  // 确保上传目录存在
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ 创建上传目录:', uploadsDir);
    }
  } catch (fsError) {
    console.error('❌ 创建上传目录失败:', fsError);
    console.warn('⚠️ 文件上传功能可能不可用');
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "服务器内部错误";
    
    console.error('服务器错误:', message);
    if (err.stack) {
      console.error(err.stack);
    }

    res.status(status).json({ message });
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
      console.log(`🚀 服务器启动成功，监听端口 ${port}`);
    });
  } catch (error) {
    console.error(`❌ 服务器启动失败: ${error}`);
    process.exit(1);
  }
})();
