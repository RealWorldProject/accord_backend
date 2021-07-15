import express from "express";
import {
    ADD_CATEGORY,
    VIEW_CATEGORY,
    UPDATE_DELETE_CATEGORY,
} from "../constants/category.constants";
import {
    validateCategoryBody,
    checkCategoryUniqueness,
} from "../middleware/category.middleware";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    addCategory,
    viewCategory,
    updateCategory,
} from "../controllers/category.controllers";

const categoryRoutes = express.Router();

categoryRoutes.post(
    ADD_CATEGORY,
    authenticateToken,
    isAdmin,
    validateCategoryBody,
    checkCategoryUniqueness,
    addCategory
);

categoryRoutes.get(
    VIEW_CATEGORY,
    authenticateToken,
    viewCategory
)

categoryRoutes.put(
    UPDATE_DELETE_CATEGORY,
    authenticateToken,
    isAdmin,
    validateCategoryBody,
    checkCategoryUniqueness,
    updateCategory
)

export = categoryRoutes;