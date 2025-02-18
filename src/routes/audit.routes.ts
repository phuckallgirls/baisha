import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 内容审核路由
router.post('/text', auth, AuditController.auditText);
router.post('/image', auth, AuditController.auditImage);
router.post('/images', auth, AuditController.auditMultipleImages);

export default router; 