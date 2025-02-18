import { Request, Response } from 'express';
import { Post } from '../models/post.model';
import { Category } from '../models/category.model';

export class PostController {
  // 获取帖子列表
  static async getList(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type, 
        categoryId,
        keyword
      } = req.query;

      // 构建查询条件
      const query: any = { status: 'active' };
      
      if (type) {
        query.type = type;
      }
      
      if (categoryId) {
        query.categoryId = categoryId;
      }
      
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        ];
      }

      // 查询帖子
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

  // 创建帖子
  static async create(req: Request, res: Response) {
    try {
      const { 
        title, 
        content, 
        type, 
        categoryId,
        price,
        images,
        location,
        contact
      } = req.body;

      // 验证分类是否存在
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          code: 1,
          msg: '分类不存在',
          data: null
        });
      }

      // 创建帖子
      const post = new Post({
        title,
        content,
        type,
        categoryId,
        price,
        images,
        location,
        contact,
        author: req.user.id,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后过期
      });

      await post.save();

      res.json({
        code: 0,
        msg: '发布成功',
        data: post
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // 获取帖子详情
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate('author', 'username avatar')
        .populate('categoryId', 'name');

      if (!post) {
        return res.status(404).json({
          code: 1,
          msg: '帖子不存在',
          data: null
        });
      }

      // 增加浏览量
      post.views += 1;
      await post.save();

      res.json({
        code: 0,
        msg: '获取成功',
        data: post
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // 更新帖子
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const post = await Post.findOne({
        _id: id,
        author: req.user.id
      });

      if (!post) {
        return res.status(404).json({
          code: 1,
          msg: '帖子不存在或无权限',
          data: null
        });
      }

      // 更新帖子
      Object.assign(post, updateData);
      post.updatedAt = new Date();
      await post.save();

      res.json({
        code: 0,
        msg: '更新成功',
        data: post
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
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await Post.findOne({
        _id: id,
        author: req.user.id
      });

      if (!post) {
        return res.status(404).json({
          code: 1,
          msg: '帖子不存在或无权限',
          data: null
        });
      }

      // 软删除
      post.status = 'closed';
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
} 