import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  // 关注者
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 被关注者
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建复合唯一索引，确保不重复关注
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// 创建索引
followSchema.index({ follower: 1, createdAt: -1 });
followSchema.index({ following: 1, createdAt: -1 });

export const Follow = mongoose.model('Follow', followSchema); 