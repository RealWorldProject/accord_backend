import express from "express";
import { ADD_CATEGORY, VIEW_CATEGORY, DELETE_CATEGORY } from "../constants/category.constants";
import { addCategory } from "../controllers/category.controllers";
import { validateCategoryBody } from "../middleware/category.middleware";
import { authenticateToken, isAdmin } from "../middleware/authentication.middleware";

const categoryRoutes = express.Router();

categoryRoutes.post(ADD_CATEGORY, authenticateToken, isAdmin, validateCategoryBody, addCategory);

export = categoryRoutes;