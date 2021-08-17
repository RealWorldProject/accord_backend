import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Review from "../models/Review.model";

// **************** Add review and rating ****************
export const addReviewAndRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    const bookID = req?.params?.bookID;

    try {
        const { review, rating } = req.body;
        const reviewRatingObj = new Review({
            review,
            rating,
            book: bookID,
            user: userID,
        });
        const reviewRating = await reviewRatingObj
            .save()
            .then((userReviewRating) =>
                userReviewRating
                    .populate("userId", "fullName email image")
                    .execPopulate()
            );
        if (reviewRating) {
            return res.status(CREATED).json({
                success: true,
                message: label.review.reviewSuccess,
                developerMessage: "",
                result: reviewRating,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.review.reviewError,
            developerMessage: error.message,
            result: {},
        });
    }
};
