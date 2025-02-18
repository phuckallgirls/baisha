import mongoose from 'mongoose';
import { PostType } from './post.model';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  // 所属帖子类型
  postType: { 
    type: String,
    enum: Object.values(PostType),
    required: true
  },

  // 父分类
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },

  // 排序
  sort: { 
    type: Number, 
    default: 0 
  },

  // 图标
  icon: { 
    type: String 
  },

  // 是否启用
  isActive: { 
    type: Boolean, 
    default: true 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 创建索引
categorySchema.index({ postType: 1, sort: -1 });
categorySchema.index({ parent: 1 });

export const Category = mongoose.model('Category', categorySchema); 