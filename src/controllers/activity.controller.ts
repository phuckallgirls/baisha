import { Request, Response } from 'express';
import { Activity } from '../models/activity.model';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class ActivityController {
  // 创建活动
  static async create(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        cover,
        location,
        startTime,
        endTime,
        registrationDeadline,
        maxParticipants,
        type
      } = req.body;

      const activity = new Activity({
        title,
        description,
        cover,
        location,
        startTime,
        endTime,
        registrationDeadline,
        maxParticipants,
        type,
        organizer: req.user.id
      });

      await activity.save();

      res.json({
        code: 0,
        msg: '创建成功',
        data: activity
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '创建失败',
        data: null
      });
    }
  }

  // 获取活动列表
  static async getList(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10,
        status,
        type 
      } = req.query;

      // 构建查询条件
      const query: any = {};
      
      if (status) {
        query.status = status;
      }
      
      if (type) {
        query.type = type;
      }

      const activities = await Activity.find(query)
        .populate('organizer', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Activity.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: activities,
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

  // 获取活动详情
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const activity = await Activity.findById(id)
        .populate('organizer', 'username avatar')
        .populate('participants.user', 'username avatar');

      if (!activity) {
        return res.status(404).json({
          code: 1,
          msg: '活动不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '获取成功',
        data: activity
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '获取失败',
        data: null
      });
    }
  }

  // 报名活动
  static async register(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({
          code: 1,
          msg: '活动不存在',
          data: null
        });
      }

      // 检查活动状态
      if (activity.status !== 'published') {
        return res.status(400).json({
          code: 1,
          msg: '活动未开放报名',
          data: null
        });
      }

      // 检查是否已报名
      const existingRegistration = activity.participants.find(
        p => p.user.toString() === userId
      );

      if (existingRegistration) {
        return res.status(400).json({
          code: 1,
          msg: '已经报名过了',
          data: null
        });
      }

      // 检查人数限制
      if (activity.currentParticipants >= activity.maxParticipants) {
        return res.status(400).json({
          code: 1,
          msg: '活动名额已满',
          data: null
        });
      }

      // 添加报名记录
      activity.participants.push({
        user: userId,
        status: 'pending'
      });
      activity.currentParticipants += 1;

      await activity.save();

      // 发送通知给活动组织者
      await notificationService.createPostNotification({
        recipientId: activity.organizer.toString(),
        senderId: userId,
        title: '活动报名通知',
        content: `有新用户报名参加活动：${activity.title}`,
        postId: activity._id
      });

      res.json({
        code: 0,
        msg: '报名成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '报名失败',
        data: null
      });
    }
  }

  // 取消报名
  static async cancelRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({
          code: 1,
          msg: '活动不存在',
          data: null
        });
      }

      // 查找并移除报名记录
      const participantIndex = activity.participants.findIndex(
        p => p.user.toString() === userId
      );

      if (participantIndex === -1) {
        return res.status(400).json({
          code: 1,
          msg: '未报名该活动',
          data: null
        });
      }

      activity.participants.splice(participantIndex, 1);
      activity.currentParticipants -= 1;

      await activity.save();

      res.json({
        code: 0,
        msg: '取消报名成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '取消报名失败',
        data: null
      });
    }
  }
} 