import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { auth } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// 文件上传路由
router.post('/file', auth, upload.single('file'), UploadController.uploadFile);
router.post('/files', auth, upload.array('files', 9), UploadController.uploadMultipleFiles);
router.post('/delete', auth, UploadController.deleteFile);

export default router; 