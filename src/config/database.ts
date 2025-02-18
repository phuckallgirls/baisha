import mongoose from 'mongoose';
import { config } from './index';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('数据库连接成功');

    // 数据库连接错误处理
    mongoose.connection.on('error', (err) => {
      console.error('数据库连接错误:', err);
    });

    // 数据库断开处理
    mongoose.connection.on('disconnected', () => {
      console.log('数据库连接断开');
    });
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

// 优雅关闭数据库连接
export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('关闭数据库连接时出错:', error);
    process.exit(1);
  }
}; 