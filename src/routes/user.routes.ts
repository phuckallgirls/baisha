import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middlewares/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// 公开路由
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.login(req, res);
  } catch (error) {
    next(error);
  }
});

// 需要认证的路由
router.get('/info', auth as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.getInfo(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/info', auth as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.updateInfo(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 