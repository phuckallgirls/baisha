import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './config/database';

// 导入路由
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import activityRoutes from './routes/activity.routes';
import followRoutes from './routes/follow.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import searchRoutes from './routes/search.routes';
import auditRoutes from './routes/audit.routes';
import categoryRoutes from './routes/category.routes';
import reportRoutes from './routes/report.routes';
import favoriteRoutes from './routes/favorite.routes';
import adminRoutes from './routes/admin.routes';

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// 连接数据库
connectDatabase();

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 错误处理
process.on('unhandledRejection', (err: Error) => {
  console.error('未处理的 Promise 拒绝:', err);
});

process.on('uncaughtException', (err: Error) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
}); 