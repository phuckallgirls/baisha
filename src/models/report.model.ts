import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // 举报人
  reporter: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 被举报的帖子
  post: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },

  // 举报类型
  type: { 
    type: String,
    enum: [
      'spam',          // 垃圾广告
      'illegal',       // 违法违规
      'porn',          // 色情
      'fraud',         // 诈骗
      'other'          // 其他
    ],
    required: true
  },

  // 举报描述
  description: { 
    type: String,
    required: true
  },

  // 举报状态：pending-待处理，processed-已处理
  status: { 
    type: String,
    enum: ['pending', 'processed'],
    default: 'pending'
  },

  // 处理结果
  result: { 
    type: String 
  },

  // 处理时间
  processedAt: { 
    type: Date 
  },

  // 处理人
  processor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 创建索引
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ post: 1, reporter: 1 });

export const Report = mongoose.model('Report', reportSchema); 