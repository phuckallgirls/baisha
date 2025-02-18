import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 所有收藏相关的路由都需要认证
router.post('/add', auth, FavoriteController.add);
router.delete('/delete/:postId', auth, FavoriteController.delete);
router.get('/list', auth, FavoriteController.getList);

export default router; 