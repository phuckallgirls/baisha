import { Request, Response } from 'express';
import { Report } from '../models/report.model';
import { Post } from '../models/post.model';

export class ReportController {
  // 创建举报
  static async create(req: Request, res: Response) {
    try {
      const { postId, type, description } = req.body;
      const userId = req.user.id;

      // 检查帖子是否存在
      const post = await Post.findById(postId);
      if (!post) {
        return res.json({
          code: 1,
          msg: '帖子不存在',
          data: null
        });
      }

      // 检查是否已经举报过
      const existingReport = await Report.findOne({
        reporter: userId,
        post: postId,
        status: 'pending'
      });

      if (existingReport) {
        return res.json({
          code: 1,
          msg: '您已经举报过该帖子',
          data: null
        });
      }

      // 创建举报
      const report = new Report({
        reporter: userId,
        post: postId,
        type,
        description
      });

      await report.save();

      res.json({
        code: 0,
        msg: '举报成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // [管理员] 获取举报列表
  static async getList(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10,
        status
      } = req.query;

      // 构建查询条件
      const query: any = {};
      if (status) {
        query.status = status;
      }

      // 查询举报列表
      const reports = await Report.find(query)
        .populate('reporter', 'username avatar')
        .populate({
          path: 'post',
          select: 'title content type',
          populate: {
            path: 'author',
            select: 'username'
          }
        })
        .populate('processor', 'username')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // 获取总数
      const total = await Report.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: reports,
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
        msg: '服务器错误',
        data: null
      });
    }
  }

  // [管理员] 处理举报
  static async process(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { result, postAction } = req.body;
      const adminId = req.user.id;

      const report = await Report.findById(id);
      if (!report) {
        return res.json({
          code: 1,
          msg: '举报不存在',
          data: null
        });
      }

      if (report.status === 'processed') {
        return res.json({
          code: 1,
          msg: '该举报已处理',
          data: null
        });
      }

      // 更新举报状态
      report.status = 'processed';
      report.result = result;
      report.processor = adminId;
      report.processedAt = new Date();

      // 如果需要处理帖子
      if (postAction) {
        const post = await Post.findById(report.post);
        if (post) {
          post.status = postAction; // 'banned' 或其他状态
          await post.save();
        }
      }

      await report.save();

      res.json({
        code: 0,
        msg: '处理成功',
        data: null
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }
} 