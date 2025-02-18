import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  // 评论内容
  content: {
    type: String,
    required: true,
    trim: true
  },

  // 评论作者
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 关联的帖子
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },

  // 父评论（如果是回复）
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },

  // 评论状态：active-正常, deleted-已删除
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },

  // 点赞数
  likes: {
    type: Number,
    default: 0
  },

  // 点赞用户
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },

  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema); 