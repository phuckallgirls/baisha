import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  // 活动标题
  title: {
    type: String,
    required: true,
    trim: true
  },

  // 活动描述
  description: {
    type: String,
    required: true
  },

  // 活动封面图
  cover: {
    type: String,
    required: true
  },

  // 活动地点
  location: {
    type: String,
    required: true
  },

  // 活动开始时间
  startTime: {
    type: Date,
    required: true
  },

  // 活动结束时间
  endTime: {
    type: Date,
    required: true
  },

  // 报名截止时间
  registrationDeadline: {
    type: Date,
    required: true
  },

  // 活动人数限制
  maxParticipants: {
    type: Number,
    required: true
  },

  // 当前报名人数
  currentParticipants: {
    type: Number,
    default: 0
  },

  // 活动状态：draft-草稿, published-已发布, cancelled-已取消, finished-已结束
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'finished'],
    default: 'draft'
  },

  // 活动类型：online-线上, offline-线下
  type: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },

  // 活动组织者
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 活动参与者
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
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
activitySchema.index({ status: 1, startTime: -1 });
activitySchema.index({ organizer: 1, createdAt: -1 });
activitySchema.index({ 'participants.user': 1, 'participants.status': 1 });

export const Activity = mongoose.model('Activity', activitySchema); 