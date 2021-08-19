import express from "express";
import {
    ADD_REVIEW_ROUTE,
    EDIT_REVIEW_ROUTE,
    GET_REVIEW_ROUTE,
} from "../constants/review.constants";
import {
    addReviewAndRating,
    editReviewAndRating,
    getReviewAndRating,
} from "../controllers/review.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";
import { validateReviewBody } from "../middleware/review.middleware";

const reviewRoutes = express.Router();

reviewRoutes.post(
    ADD_REVIEW_ROUTE,
    authenticateToken,
    validateReviewBody,
    addReviewAndRating
);

reviewRoutes.get(GET_REVIEW_ROUTE, authenticateToken, getReviewAndRating);

reviewRoutes.patch(EDIT_REVIEW_ROUTE, authenticateToken, editReviewAndRating);

export = reviewRoutes;
