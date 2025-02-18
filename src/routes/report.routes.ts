import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// 用户举报路由
router.post('/create', auth, ReportController.create);

// 管理员路由
router.get('/list', auth, isAdmin, ReportController.getList);
router.post('/process/:id', auth, isAdmin, ReportController.process);

export default router; 