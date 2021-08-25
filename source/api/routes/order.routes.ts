import express from "express";
import {
    MAKE_ORDER,
    VIEW_MY_ORDER,
    VIEW_ORDER,
    VIEW_STATS,
} from "../constants/order.constants";
import {
    checkoutOrder,
    getOverallStats,
    viewMyOrder,
    viewOrder,
} from "../controllers/order.controllers";
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

orderRoutes.get(VIEW_MY_ORDER, authenticateToken, viewMyOrder);

// ADMIN ROUTE
orderRoutes.get(VIEW_ORDER, authenticateToken, isAdmin, viewOrder);

orderRoutes.get(VIEW_STATS, authenticateToken, isAdmin, getOverallStats);

export = orderRoutes;
