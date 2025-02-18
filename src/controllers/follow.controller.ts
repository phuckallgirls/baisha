import { Request, Response } from 'express';
import { Follow } from '../models/follow.model';
import { User } from '../models/user.model';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class FollowController {
  // 关注用户
  static async follow(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const followerId = req.user.id;

      // 不能关注自己
      if (userId === followerId) {
        return res.status(400).json({
          code: 1,
          msg: '不能关注自己',
          data: null
        });
      }

      // 检查目标用户是否存在
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      // 检查是否已关注
      const existingFollow = await Follow.findOne({
        follower: followerId,
        following: userId
      });

      if (existingFollow) {
        return res.status(400).json({
          code: 1,
          msg: '已经关注过了',
          data: null
        });
      }

      // 创建关注关系
      const follow = new Follow({
        follower: followerId,
        following: userId
      });

      await follow.save();

      // 发送通知
      await notificationService.createPostNotification({
        recipientId: userId,
        senderId: followerId,
        title: '新粉丝通知',
        content: `${req.user.username} 关注了你`,
        postId: null
      });

      res.json({
        code: 0,
        msg: '关注成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '关注失败',
        data: null
      });
    }
  }

  // 取消关注
  static async unfollow(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const followerId = req.user.id;

      const result = await Follow.findOneAndDelete({
        follower: followerId,
        following: userId
      });

      if (!result) {
        return res.status(404).json({
          code: 1,
          msg: '未关注该用户',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '取消关注成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '取消关注失败',
        data: null
      });
    }
  }

  // 获取关注列表
  static async getFollowingList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id;

      const follows = await Follow.find({ follower: userId })
        .populate('following', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Follow.countDocuments({ follower: userId });

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: follows,
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

  // 获取粉丝列表
  static async getFollowersList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id;

      const followers = await Follow.find({ following: userId })
        .populate('follower', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Follow.countDocuments({ following: userId });

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: followers,
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
} 