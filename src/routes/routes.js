import { Router } from 'express';
import { login, register, getproducts, createCart } from '../controllers/controles.js';

const router = Router();

router.post('/login', login);
router.get('/products', getproducts);
router.post('/register', register);
router.post('/createCart', createCart);

export default router;