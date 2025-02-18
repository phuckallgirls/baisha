import { Request, Response } from 'express';
import { ContentAuditService } from '../services/content-audit.service';

const contentAuditService = new ContentAuditService();

export class AuditController {
  // 审核文本内容
  static async auditText(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          code: 1,
          msg: '请提供需要审核的文本',
          data: null
        });
      }

      const result = await contentAuditService.auditText(text);

      res.json({
        code: 0,
        msg: result.pass ? '审核通过' : '审核不通过',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '审核失败',
        data: null
      });
    }
  }

  // 审核图片内容
  static async auditImage(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          code: 1,
          msg: '请提供需要审核的图片',
          data: null
        });
      }

      const result = await contentAuditService.auditImage(imageUrl);

      res.json({
        code: 0,
        msg: result.pass ? '审核通过' : '审核不通过',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '审核失败',
        data: null
      });
    }
  }

  // 批量审核图片
  static async auditMultipleImages(req: Request, res: Response) {
    try {
      const { imageUrls } = req.body;

      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        return res.status(400).json({
          code: 1,
          msg: '请提供需要审核的图片列表',
          data: null
        });
      }

      const result = await contentAuditService.auditMultipleImages(imageUrls);

      res.json({
        code: 0,
        msg: result.pass ? '审核通过' : '审核不通过',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '审核失败',
        data: null
      });
    }
  }
} 