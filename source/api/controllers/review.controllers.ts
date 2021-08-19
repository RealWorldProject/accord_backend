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

// **************** Get review and rating ****************
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

// **************** Edit review and rating ****************
export const editReviewAndRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const reviewID = req?.params?.reviewID;

    try {
        const userReview = trimObject(req.body);
        const review = await Review.findOne({
            isArchived: false,
        });

        if (review) {
            const updatedReview = await Review.findOneAndUpdate(
                { _id: reviewID },
                {
                    $set: userReview,
                },
                { new: true }
            );
            const returnReviews = {
                _id: updatedReview?._id,
                review: updatedReview?.review,
                rating: updatedReview?.rating,
            };
            return res.status(SUCCESS).json({
                success: true,
                message: label.review.reviewUpdated,
                developerMessage: "",
                result: returnReviews,
            });
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.review.errorInReviewUpdate,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.review.errorInReviewUpdate,
            developerMessage: error.message,
            result: {},
        });
    }
};
