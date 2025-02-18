import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// 所有关注相关的路由都需要认证
router.use(auth);

router.post('/:userId/follow', FollowController.follow);
router.post('/:userId/unfollow', FollowController.unfollow);
router.get('/following', FollowController.getFollowingList);
router.get('/followers', FollowController.getFollowersList);

export default router; 