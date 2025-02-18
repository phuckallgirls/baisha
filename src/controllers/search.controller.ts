import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

const searchService = new SearchService();

export class SearchController {
  // 综合搜索
  static async search(req: Request, res: Response) {
    try {
      const {
        keyword,
        type,
        page = 1,
        limit = 10,
        longitude,
        latitude
      } = req.query;

      const location = longitude && latitude ? {
        longitude: Number(longitude),
        latitude: Number(latitude)
      } : undefined;

      // 根据type决定搜索内容类型
      let result;
      if (type === 'activity') {
        result = await searchService.searchActivities({
          keyword: keyword?.toString(),
          location,
          page: Number(page),
          limit: Number(limit)
        });
      } else {
        result = await searchService.searchPosts({
          keyword: keyword?.toString(),
          location,
          page: Number(page),
          limit: Number(limit)
        });
      }

      res.json({
        code: 0,
        msg: '搜索成功',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '搜索失败',
        data: null
      });
    }
  }

  // 高级搜索帖子
  static async searchPosts(req: Request, res: Response) {
    try {
      const result = await searchService.searchPosts(req.query);

      res.json({
        code: 0,
        msg: '搜索成功',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '搜索失败',
        data: null
      });
    }
  }

  // 搜索活动
  static async searchActivities(req: Request, res: Response) {
    try {
      const result = await searchService.searchActivities(req.query);

      res.json({
        code: 0,
        msg: '搜索成功',
        data: result
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '搜索失败',
        data: null
      });
    }
  }
} 