import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// 公开路由
router.get('/list', CategoryController.getList);
router.get('/detail/:id', CategoryController.getDetail);

// 管理员路由
router.post('/create', auth, isAdmin, CategoryController.create);
router.put('/update/:id', auth, isAdmin, CategoryController.update);
router.delete('/delete/:id', auth, isAdmin, CategoryController.delete);

export default router; 