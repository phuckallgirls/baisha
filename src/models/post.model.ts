import mongoose from 'mongoose';

// 定义帖子类型枚举
export enum PostType {
  SECOND_HAND = 'second_hand',    // 二手交易
  JOB = 'job',                    // 求职招聘
  HOUSE = 'house',                // 房屋租赁
  SERVICE = 'service'             // 本地服务
}

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  
  // 帖子类型
  type: { 
    type: String, 
    enum: Object.values(PostType),
    required: true 
  },
  
  // 分类ID
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  // 价格信息
  price: {
    type: Number,
    required: function() {
      return [PostType.SECOND_HAND, PostType.HOUSE].includes(this.type);
    }
  },

  // 工作信息（求职招聘专用）
  job: {
    salary: String,
    experience: String,
    education: String,
    company: String
  },

  // 房屋信息（房屋租赁专用）
  house: {
    area: Number,
    rooms: String,
    floor: String,
    decoration: String
  },

  // 图片
  images: [{ type: String }],

  // 位置信息
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    district: String
  },

  // 联系信息
  contact: {
    name: String,
    phone: String,
    wechat: String
  },

  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  // 浏览量
  views: { 
    type: Number, 
    default: 0 
  },

  // 收藏数
  favorites: { 
    type: Number, 
    default: 0 
  },

  status: { 
    type: String, 
    enum: ['pending', 'active', 'rejected', 'closed'],
    default: 'pending' 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  },

  // 帖子过期时间
  expiredAt: { 
    type: Date,
    required: true
  }
});

// 创建索引
postSchema.index({ location: '2dsphere' });
postSchema.index({ type: 1, status: 1, createdAt: -1 });
postSchema.index({ categoryId: 1, status: 1 });
postSchema.index({ author: 1, status: 1 });

export const Post = mongoose.model('Post', postSchema);
