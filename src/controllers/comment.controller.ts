import { Request, Response } from 'express';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class CommentController {
  // 创建评论
  static async create(req: Request, res: Response) {
    try {
      const { postId, content, parentId } = req.body;
      const userId = req.user.id;

      // 检查帖子是否存在
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          code: 1,
          msg: '帖子不存在',
          data: null
        });
      }

      // 创建评论
      const comment = new Comment({
        content,
        author: userId,
        post: postId,
        parent: parentId
      });

      await comment.save();

      // 发送通知给帖子作者
      if (post.author.toString() !== userId) {
        await notificationService.createPostNotification({
          recipientId: post.author.toString(),
          senderId: userId,
          title: '新评论通知',
          content: `有人评论了你的帖子：${content}`,
          postId: postId
        });
      }

      // 如果是回复评论，还要通知原评论作者
      if (parentId) {
        const parentComment = await Comment.findById(parentId);
        if (parentComment && parentComment.author.toString() !== userId) {
          await notificationService.createPostNotification({
            recipientId: parentComment.author.toString(),
            senderId: userId,
            title: '评论回复通知',
            content: `有人回复了你的评论：${content}`,
            postId: postId
          });
        }
      }

      res.json({
        code: 0,
        msg: '评论成功',
        data: comment
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '评论失败',
        data: null
      });
    }
  }

  // 获取评论列表
  static async getList(req: Request, res: Response) {
    try {
      const { postId, page = 1, limit = 10 } = req.query;

      // 构建查询条件
      const query: any = {
        post: postId,
        status: 'active'
      };

      // 查询评论
      const comments = await Comment.find(query)
        .populate('author', 'username avatar')
        .populate('parent')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // 获取总数
      const total = await Comment.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: comments,
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

  // 删除评论
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        _id: id,
        author: userId
      });

      if (!comment) {
        return res.status(404).json({
          code: 1,
          msg: '评论不存在或无权限删除',
          data: null
        });
      }

      // 软删除
      comment.status = 'deleted';
      await comment.save();

      res.json({
        code: 0,
        msg: '删除成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '删除失败',
        data: null
      });
    }
  }

  // 点赞评论
  static async like(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({
          code: 1,
          msg: '评论不存在',
          data: null
        });
      }

      // 检查是否已点赞
      if (comment.likedBy.includes(userId)) {
        return res.status(400).json({
          code: 1,
          msg: '已经点赞过了',
          data: null
        });
      }

      // 更新点赞
      comment.likes += 1;
      comment.likedBy.push(userId);
      await comment.save();

      res.json({
        code: 0,
        msg: '点赞成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '点赞失败',
        data: null
      });
    }
  }
} 