import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';

const router = Router();

// 搜索路由
router.get('/', SearchController.search);
router.get('/posts', SearchController.searchPosts);
router.get('/activities', SearchController.searchActivities);

export default router; 