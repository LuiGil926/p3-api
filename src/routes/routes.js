import { Router } from 'express';
import { login, register, getproducts } from '../controllers/controles.js';

const router = Router();

router.post('/login', login);
router.get('/products', getproducts);
router.post('/register', register);

export default router;