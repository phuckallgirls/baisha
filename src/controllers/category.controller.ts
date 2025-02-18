import { Request, Response } from 'express';
import { Category } from '../models/category.model';

export class CategoryController {
  // 获取分类列表
  static async getList(req: Request, res: Response) {
    try {
      const { type } = req.query;

      // 构建查询条件
      const query: any = { isActive: true };
      if (type) {
        query.postType = type;
      }

      // 查询分类
      const categories = await Category.find(query)
        .sort({ sort: -1 })
        .populate('parent', 'name');

      // 构建分类树
      const categoryTree = categories
        .filter(cat => !cat.parent) // 获取顶级分类
        .map(cat => ({
          ...cat.toObject(),
          children: categories
            .filter(child => child.parent?.toString() === cat._id.toString())
        }));

      res.json({
        code: 0,
        msg: '获取成功',
        data: categoryTree
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // 获取分类详情
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id)
        .populate('parent', 'name');

      if (!category) {
        return res.status(404).json({
          code: 1,
          msg: '分类不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '获取成功',
        data: category
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // [管理员] 创建分类
  static async create(req: Request, res: Response) {
    try {
      const { name, postType, parent, sort, icon } = req.body;

      // 检查是否存在同名分类
      const existingCategory = await Category.findOne({ 
        name, 
        postType,
        parent: parent || null 
      });

      if (existingCategory) {
        return res.status(400).json({
          code: 1,
          msg: '分类名称已存在',
          data: null
        });
      }

      // 创建分类
      const category = new Category({
        name,
        postType,
        parent,
        sort,
        icon
      });

      await category.save();

      res.json({
        code: 0,
        msg: '创建成功',
        data: category
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // [管理员] 更新分类
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({
          code: 1,
          msg: '分类不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '更新成功',
        data: category
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '服务器错误',
        data: null
      });
    }
  }

  // [管理员] 删除分类
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 检查是否有子分类
      const hasChildren = await Category.exists({ parent: id });
      if (hasChildren) {
        return res.status(400).json({
          code: 1,
          msg: '请先删除子分类',
          data: null
        });
      }

      // 软删除（设置为非活动状态）
      const category = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({
          code: 1,
          msg: '分类不存在',
          data: null
        });
      }

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