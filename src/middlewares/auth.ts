import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        code: 1,
        msg: '请先登录',
        data: null
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // 查找用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        code: 1,
        msg: '用户不存在',
        data: null
      });
    }

    // 检查用户状态
    if (user.status === 'banned') {
      return res.status(403).json({
        code: 1,
        msg: '账号已被禁用',
        data: null
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      code: 1,
      msg: '认证失败',
      data: null
    });
  }
};
