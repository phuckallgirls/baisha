import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  // 获取通知列表
  static async getList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const userId = req.user.id;

      // 构建查询条件
      const query: any = { recipient: userId };
      if (type) {
        query.type = type;
      }

      const notifications = await Notification.find(query)
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Notification.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: notifications,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '获取失败',
        data: null
      });
    }
  }

  // 标记通知为已读
  static async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await notificationService.markAsRead(id, userId);

      if (!notification) {
        return res.status(404).json({
          code: 1,
          msg: '通知不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '标记成功',
        data: notification
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '标记失败',
        data: null
      });
    }
  }

  // 标记所有通知为已读
  static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      await notificationService.markAllAsRead(userId);

      res.json({
        code: 0,
        msg: '标记成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '标记失败',
        data: null
      });
    }
  }

  // 获取未读通知数量
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const count = await notificationService.getUnreadCount(userId);

      res.json({
        code: 0,
        msg: '获取成功',
        data: { count }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '获取失败',
        data: null
      });
    }
  }
} 