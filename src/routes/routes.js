import { Router } from "express";
import {
  login,
  register,
  getproducts,
  createCart,
  getCart,
  addCart,
  deleteProduct,
} from "../controllers/controles.js";

const router = Router();

router.post("/login", login);
router.get("/products", getproducts);
router.post("/register", register);
router.post("/createCart", createCart);
router.post("/getCart", getCart);
router.post("/addCart", addCart);
router.post("/deleteProduct", deleteProduct);

export default router;
