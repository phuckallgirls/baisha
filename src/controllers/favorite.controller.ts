import { Request, Response } from 'express';
import { Favorite } from '../models/favorite.model';
import { Post } from '../models/post.model';

export class FavoriteController {
  // 添加收藏
  static async add(req: Request, res: Response) {
    try {
      const { postId } = req.body;
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

      // 检查是否已收藏
      const existingFavorite = await Favorite.findOne({
        user: userId,
        post: postId
      });

      if (existingFavorite) {
        return res.status(400).json({
          code: 1,
          msg: '已经收藏过了',
          data: null
        });
      }

      // 创建收藏
      const favorite = new Favorite({
        user: userId,
        post: postId
      });

      await favorite.save();

      res.json({
        code: 0,
        msg: '收藏成功',
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

  // 取消收藏
  static async delete(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const result = await Favorite.findOneAndDelete({
        user: userId,
        post: postId
      });

      if (!result) {
        return res.status(404).json({
          code: 1,
          msg: '收藏不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '取消收藏成功',
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

  // 获取收藏列表
  static async getList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id;

      // 查询收藏列表
      const favorites = await Favorite.find({ user: userId })
        .populate({
          path: 'post',
          select: 'title content type images price createdAt',
          populate: {
            path: 'author',
            select: 'username avatar'
          }
        })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // 获取总数
      const total = await Favorite.countDocuments({ user: userId });

      // 过滤掉已删除的帖子
      const validFavorites = favorites.filter(f => f.post !== null);

      res.json({
        code: 0,
        msg: '获取成功',
        data: {
          list: validFavorites,
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
} 