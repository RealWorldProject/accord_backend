import express from "express";
import { MAKE_ORDER, VIEW_ORDER } from "../constants/order.constants";
import { checkoutOrder, viewOrder } from "../controllers/order.controllers";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import { validateOrderBody } from "../middleware/order.middleware";

const orderRoutes = express.Router();

// USER ROUTE
orderRoutes.post(
    MAKE_ORDER,
    authenticateToken,
    validateOrderBody,
    checkoutOrder
);

// ADMIN ROUTE
orderRoutes.get(VIEW_ORDER, authenticateToken, isAdmin, viewOrder);

export = orderRoutes;
