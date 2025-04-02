import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.originalname
      .replace(/\..*$/, '') // 移除原始扩展名
      .replace(/[^a-z0-9]/gi, '-') // 替换非法字符为连字符
      .toLowerCase();
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的文件类型
  const allowedMimeTypes = {
    'md': ['text/markdown', 'text/plain', 'text/x-markdown'],
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  };

  // 根据字段名检查文件类型
  if (file.fieldname === 'md') {
    if (file.originalname.toLowerCase().endsWith('.md') || allowedMimeTypes.md.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传 Markdown 文件'));
    }
  } else if (file.fieldname === 'image') {
    if (allowedMimeTypes.image.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传 JPG、PNG、GIF 和 WebP 格式的图片'));
    }
  } else {
    cb(new Error('无效的字段名'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 2 // 最多允许上传 2 个文件（1个 MD 文件和 1个图片）
  }
});