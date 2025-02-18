import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 公开路由
router.get('/list', PostController.getList);
router.get('/detail/:id', PostController.getDetail);

// 需要认证的路由
router.post('/create', auth, PostController.create);
router.put('/update/:id', auth, PostController.update);
router.delete('/delete/:id', auth, PostController.delete);

export default router; 