import express from "express";
import { MAKE_ORDER, VIEW_ORDER } from "../constants/order.constants";
import { makeOrder, viewOrder } from "../controllers/order.controllers";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";

const orderRoutes = express.Router();

// USER ROUTE
orderRoutes.post(MAKE_ORDER, authenticateToken, makeOrder);

// ADMIN ROUTE
orderRoutes.post(VIEW_ORDER, authenticateToken, isAdmin, viewOrder);

export = orderRoutes;
