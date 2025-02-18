import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 获取评论列表（公开）
router.get('/list', CommentController.getList);

// 需要认证的路由
router.post('/create', auth, CommentController.create);
router.delete('/:id', auth, CommentController.delete);
router.post('/:id/like', auth, CommentController.like);

export default router; 