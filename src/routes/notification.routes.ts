import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 所有通知路由都需要认证
router.use(auth);

router.get('/list', NotificationController.getList);
router.post('/:id/read', NotificationController.markAsRead);
router.post('/read-all', NotificationController.markAllAsRead);
router.get('/unread-count', NotificationController.getUnreadCount);

export default router; 