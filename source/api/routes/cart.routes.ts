import express from "express";
import { ADD_TO_CART, VIEW_CART } from "../constants/cart.constants";
import { addToCart, viewCartBooks } from "../controllers/cart.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";

const cartRoutes = express.Router();

cartRoutes.post(ADD_TO_CART, authenticateToken, addToCart);
cartRoutes.get(VIEW_CART, authenticateToken, viewCartBooks);

export = cartRoutes;
