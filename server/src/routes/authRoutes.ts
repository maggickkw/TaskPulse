import {Router} from 'express';
import { login, register } from '../controllers/authController';
import { validateRegisterInput, validateLoginInput } from '../middleware/validation.middleware';
import { uploadMiddleware } from '../middleware/multer';

const router = Router();

router.post('/register', uploadMiddleware, register);
router.post('/login', validateLoginInput, login);

export default router;