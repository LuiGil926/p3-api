import { Router } from 'express';
import { login, register, getproducts, createCart, getCart, updateCart, addCart } from '../controllers/controles.js';

const router = Router();

router.post('/login', login);
router.get('/products', getproducts);
router.post('/register', register);
router.post('/createCart', createCart);
router.post('/getCart', getCart);
router.post('/updateCart', updateCart);
router.post('/addCart', addCart);


export default router;