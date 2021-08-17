import express from "express";
import { ADD_REVIEW_ROUTE } from "../constants/review.constants";
import { addReviewAndRating } from "../controllers/review.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";
import { validateReviewBody } from "../middleware/review.middleware";

const reviewRoutes = express.Router();

reviewRoutes.post(
    ADD_REVIEW_ROUTE,
    authenticateToken,
    validateReviewBody,
    addReviewAndRating
);

export = reviewRoutes;
