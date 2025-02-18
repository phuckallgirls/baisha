import { Request, Response } from 'express';
import { OssService } from '../services/oss.service';
import multer from 'multer';
import { config } from '../config';

const ossService = new OssService();

export class UploadController {
  // 上传单个文件
  static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 1,
          msg: '请选择要上传的文件',
          data: null
        });
      }

      // 验证文件类型
      if (!config.upload.allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          code: 1,
          msg: '不支持的文件类型',
          data: null
        });
      }

      // 验证文件大小
      if (req.file.size > config.upload.maxSize) {
        return res.status(400).json({
          code: 1,
          msg: '文件大小超出限制',
          data: null
        });
      }

      // 上传到OSS
      const fileUrl = await ossService.uploadFile(req.file);

      res.json({
        code: 0,
        msg: '上传成功',
        data: {
          url: fileUrl
        }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '文件上传失败',
        data: null
      });
    }
  }

  // 上传多个文件
  static async uploadMultipleFiles(req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({
          code: 1,
          msg: '请选择要上传的文件',
          data: null
        });
      }

      const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
        ossService.uploadFile(file)
      );

      const urls = await Promise.all(uploadPromises);

      res.json({
        code: 0,
        msg: '上传成功',
        data: {
          urls
        }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '文件上传失败',
        data: null
      });
    }
  }

  // 删除文件
  static async deleteFile(req: Request, res: Response) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          code: 1,
          msg: '请提供文件URL',
          data: null
        });
      }

      const result = await ossService.deleteFile(url);

      if (!result) {
        return res.status(400).json({
          code: 1,
          msg: '文件删除失败',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '删除成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '文件删除失败',
        data: null
      });
    }
  }
} 