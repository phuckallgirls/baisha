import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import bcrypt from 'bcryptjs';

export class AdminController {
  // 获取用户列表
  static async getUserList(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10,
        keyword,
        status 
      } = req.query;

      // 构建查询条件
      const query: any = {};
      
      if (status) {
        query.status = status;
      }
      
      if (keyword) {
        query.$or = [
          { username: { $regex: keyword, $options: 'i' } },
          { phone: { $regex: keyword, $options: 'i' } }
        ];
      }

      // 排除超级管理员
      query.role = { $ne: 'admin' };

      // 查询用户列表
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // 获取总数
      const total = await User.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: users,
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

  // 更新用户状态
  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // 检查用户是否存在
      const user = await User.findById(id);
      if (!user) {
        return res.json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      // 不能修改管理员状态
      if (user.role === 'admin') {
        return res.json({
          code: 1,
          msg: '不能修改管理员状态',
          data: null
        });
      }

      // 更新状态
      user.status = status;
      await user.save();

      res.json({
        code: 0,
        msg: '更新成功',
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

  // 删除用户
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 检查用户是否存在
      const user = await User.findById(id);
      if (!user) {
        return res.json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      // 不能删除管理员
      if (user.role === 'admin') {
        return res.json({
          code: 1,
          msg: '不能删除管理员',
          data: null
        });
      }

      // 删除用户
      await User.findByIdAndDelete(id);

      // 删除用户的帖子
      await Post.updateMany(
        { author: id },
        { status: 'deleted' }
      );

      res.json({
        code: 0,
        msg: '删除成功',
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

  // 重置用户密码
  static async resetUserPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      // 检查用户是否存在
      const user = await User.findById(id);
      if (!user) {
        return res.json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      // 不能修改管理员密码
      if (user.role === 'admin') {
        return res.json({
          code: 1,
          msg: '不能修改管理员密码',
          data: null
        });
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // 更新密码
      user.password = hashedPassword;
      await user.save();

      res.json({
        code: 0,
        msg: '密码重置成功',
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

  // 获取帖子列表
  static async getPostList(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10,
        type,
        status,
        keyword 
      } = req.query;

      // 构建查询条件
      const query: any = {};
      
      if (type) {
        query.type = type;
      }
      
      if (status) {
        query.status = status;
      }
      
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        ];
      }

      // 查询帖子列表
      const posts = await Post.find(query)
        .populate('author', 'username avatar')
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // 获取总数
      const total = await Post.countDocuments(query);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: posts,
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

  // 审核帖子
  static async reviewPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.json({
          code: 1,
          msg: '帖子不存在',
          data: null
        });
      }

      // 更新帖子状态
      post.status = status;
      if (reason) {
        post.reviewReason = reason;
      }
      post.reviewedAt = new Date();
      post.reviewer = req.user.id;

      await post.save();

      res.json({
        code: 0,
        msg: '审核成功',
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

  // 删除帖子
  static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) {
        return res.json({
          code: 1,
          msg: '帖子不存在',
          data: null
        });
      }

      // 软删除帖子
      post.status = 'deleted';
      await post.save();

      res.json({
        code: 0,
        msg: '删除成功',
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

  // 获取系统统计数据
  static async getStatistics(req: Request, res: Response) {
    try {
      // 用户统计
      const userCount = await User.countDocuments({ role: 'user' });
      const todayUsers = await User.countDocuments({
        role: 'user',
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        }
      });

      // 帖子统计
      const postCount = await Post.countDocuments();
      const pendingPosts = await Post.countDocuments({ status: 'pending' });
      const todayPosts = await Post.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        }
      });

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          users: {
            total: userCount,
            today: todayUsers
          },
          posts: {
            total: postCount,
            pending: pendingPosts,
            today: todayPosts
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
} 