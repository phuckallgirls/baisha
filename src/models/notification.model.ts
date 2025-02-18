import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // 接收用户
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 发送用户（系统消息为null）
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 消息类型：system-系统消息, post-帖子相关, comment-评论相关
  type: {
    type: String,
    enum: ['system', 'post', 'comment'],
    required: true
  },

  // 消息标题
  title: {
    type: String,
    required: true
  },

  // 消息内容
  content: {
    type: String,
    required: true
  },

  // 相关资源ID（如帖子ID）
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  // 是否已读
  isRead: {
    type: Boolean,
    default: false
  },

  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model('Notification', notificationSchema); 