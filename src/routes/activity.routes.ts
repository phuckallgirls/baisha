import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// 公开路由
router.get('/list', ActivityController.getList);
router.get('/:id', ActivityController.getDetail);

// 需要认证的路由
router.post('/create', auth, isAdmin, ActivityController.create);
router.post('/:id/register', auth, ActivityController.register);
router.post('/:id/cancel', auth, ActivityController.cancelRegistration);

export default router; 