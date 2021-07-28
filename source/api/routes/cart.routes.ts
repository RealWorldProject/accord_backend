import express from "express";
import { ADD_TO_CART } from "../constants/cart.constants";
import { addToCart } from "../controllers/cart.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";

const cartRoutes = express.Router();

cartRoutes.post(ADD_TO_CART, authenticateToken, addToCart);

export = cartRoutes;
