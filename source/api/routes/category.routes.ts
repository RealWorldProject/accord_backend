import express from "express";
import {
    ADD_CATEGORY,
    VIEW_CATEGORY,
    DELETE_CATEGORY
} from "../constants/category.constants";
import {
    validateCategoryBody,
    checkCategoryUniqueness
} from "../middleware/category.middleware";
import {
    authenticateToken,
    isAdmin
} from "../middleware/authentication.middleware";
import {
    addCategory,
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

export = categoryRoutes;