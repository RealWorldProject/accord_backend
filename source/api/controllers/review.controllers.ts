import { Request, Response, NextFunction } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Review from "../models/Review.model";
import { trimObject } from "../utilities/helperFunctions";

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

// **************** Add review and rating ****************
export const getReviewAndRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookID = req?.params?.bookID;

    try {
        const query = trimObject({
            book: bookID,
        });
        console.log(query);

        const reviews = await Review.find(query).populate(
            "user",
            "fullName email image"
        );
        const totalReviews = await Review.countDocuments(query);
        if (reviews.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.review.reviewsFetch,
                developerMessage: "",
                total: totalReviews,
                result: reviews,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.review.noReviews,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.review.reviewsFetchError,
            developerMessage: error.message,
            result: {},
        });
    }
};
