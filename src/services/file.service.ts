import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class FileService {
  private uploadDir: string;
  private allowedTypes: string[];
  private maxSize: number;

  constructor() {
    this.uploadDir = 'public/uploads';
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    this.maxSize = 5 * 1024 * 1024; // 5MB

    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // 配置multer
  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  // 文件过滤器
  private fileFilter = (req: any, file: any, cb: any) => {
    if (!this.allowedTypes.includes(file.mimetype)) {
      cb(new Error('不支持的文件类型'), false);
      return;
    }
    cb(null, true);
  };

  // 创建上传中间件
  public upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: {
      fileSize: this.maxSize
    }
  });

  // 删除文件
  public async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  // 获取文件URL
  public getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
} 