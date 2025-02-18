import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  // 用户ID
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 收藏的帖子ID
  post: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 同一用户不能重复收藏同一帖子
favoriteSchema.index({ user: 1, post: 1 }, { unique: true });
// 用于查询用户的收藏列表
favoriteSchema.index({ user: 1, createdAt: -1 });

export const Favorite = mongoose.model('Favorite', favoriteSchema); 