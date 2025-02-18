import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  username: string;
  password: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  phone?: string;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  // 用户名
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },

  // 密码（加密存储）
  password: { 
    type: String, 
    required: true 
  },

  // 邮箱
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // 手机号
  phone: { 
    type: String,
    unique: true,
    sparse: true  // 允许为空的情况下的唯一索引
  },

  // 头像
  avatar: { 
    type: String 
  },

  // 用户角色：user-普通用户，admin-管理员
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user'
  },

  // 用户状态：active-正常，banned-禁用
  status: { 
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },

  // 最后登录时间
  lastLoginAt: { 
    type: Date 
  },

  // 最后登录IP
  lastLoginIp: { 
    type: String 
  },

  // 用户简介
  bio: {
    type: String
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 保存前对密码进行加密
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// 验证密码的方法
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 创建索引
userSchema.index({ username: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1, status: 1 });

export const User = mongoose.model<UserDocument>('User', userSchema); 