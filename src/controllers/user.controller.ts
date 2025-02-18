import { Request, Response } from 'express';
import { User, UserDocument } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export class UserController {
  // 用户注册
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;

      // 检查用户是否已存在
      const existingUser = await User.findOne({ 
        $or: [{ username }, { email }] 
      });

      if (existingUser) {
        return res.status(400).json({
          code: 1,
          msg: '用户名或邮箱已存在',
          data: null
        });
      }

      // 创建新用户
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        password: hashedPassword,
        email
      });

      await user.save();

      res.status(201).json({
        code: 0,
        msg: '注册成功',
        data: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '注册失败',
        data: null
      });
    }
  }

  // 用户登录
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findOne({ username }) as UserDocument;
      if (!user) {
        return res.status(401).json({
          code: 1,
          msg: '用户名或密码错误',
          data: null
        });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          code: 1,
          msg: '用户名或密码错误',
          data: null
        });
      }

      // 生成 token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        config.jwt.secret as string,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({
        code: 0,
        msg: '登录成功',
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '登录失败',
        data: null
      });
    }
  }

  // 获取用户信息
  static async getInfo(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await User.findById(userId).select('-password') as UserDocument;

      if (!user) {
        return res.status(404).json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '获取成功',
        data: user
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '获取失败',
        data: null
      });
    }
  }

  // 更新用户信息
  static async updateInfo(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { username, email, avatar, bio } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { username, email, avatar, bio },
        { new: true }
      ).select('-password') as UserDocument;

      if (!user) {
        return res.status(404).json({
          code: 1,
          msg: '用户不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '更新成功',
        data: user
      });
    } catch (err) {
      res.status(500).json({
        code: 1,
        msg: '更新失败',
        data: null
      });
    }
  }
} 