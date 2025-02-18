import { Post } from '../models/post.model';
import { Activity } from '../models/activity.model';
import { CacheService } from './cache.service';

export class SearchService {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  // 高级搜索帖子
  async searchPosts(params: {
    keyword?: string;
    type?: string;
    categoryId?: string;
    location?: {
      longitude: number;
      latitude: number;
      maxDistance?: number; // 单位：米
    };
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    const {
      keyword,
      type,
      categoryId,
      location,
      tags,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = params;

    // 构建查询条件
    const query: any = { status: 'active' };

    // 关键词搜索
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // 类型筛选
    if (type) {
      query.type = type;
    }

    // 分类筛选
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // 标签筛选
    if (tags && tags.length > 0) {
      query.tags = { $all: tags };
    }

    // 日期范围筛选
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = startDate;
      }
      if (endDate) {
        query.createdAt.$lte = endDate;
      }
    }

    // 地理位置搜索
    if (location) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          },
          $maxDistance: location.maxDistance || 5000 // 默认5公里
        }
      };
    }

    // 尝试从缓存获取结果
    const cacheKey = `search:posts:${JSON.stringify(params)}`;
    const cachedResult = this.cacheService.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    // 执行查询
    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('categoryId', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(query);

    const result = {
      list: posts,
      pagination: {
        page,
        limit,
        total
      }
    };

    // 缓存结果
    this.cacheService.set(cacheKey, result, 300); // 缓存5分钟

    return result;
  }

  // 搜索活动
  async searchActivities(params: {
    keyword?: string;
    type?: string;
    status?: string;
    location?: {
      longitude: number;
      latitude: number;
      maxDistance?: number;
    };
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      keyword,
      type,
      status,
      location,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = params;

    // 构建查询条件
    const query: any = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = startDate;
      }
      if (endDate) {
        query.startTime.$lte = endDate;
      }
    }

    if (location) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          },
          $maxDistance: location.maxDistance || 5000
        }
      };
    }

    // 尝试从缓存获取结果
    const cacheKey = `search:activities:${JSON.stringify(params)}`;
    const cachedResult = this.cacheService.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    // 执行查询
    const activities = await Activity.find(query)
      .populate('organizer', 'username avatar')
      .sort({ startTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Activity.countDocuments(query);

    const result = {
      list: activities,
      pagination: {
        page,
        limit,
        total
      }
    };

    // 缓存结果
    this.cacheService.set(cacheKey, result, 300);

    return result;
  }
} 