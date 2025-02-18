import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// 所有路由都需要管理员权限
router.use(auth, isAdmin);

// 用户管理路由
router.get('/users', AdminController.getUserList);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);
router.post('/users/:id/reset-password', AdminController.resetUserPassword);

// 帖子管理路由
router.get('/posts', AdminController.getPostList);
router.put('/posts/:id/review', AdminController.reviewPost);
router.delete('/posts/:id', AdminController.deletePost);

// 统计数据
router.get('/statistics', AdminController.getStatistics);

export default router; 