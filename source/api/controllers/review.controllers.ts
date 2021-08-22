import { Request, Response, NextFunction } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import PostBook from "../models/PostBook.model";
import Review from "../models/Review.model";
import { getAverageReview, trimObject } from "../utilities/helperFunctions";

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
                    .populate("user", "fullName email image")
                    .execPopulate()
            );
        if (reviewRating) {
            // calculating average rating
            const reviews = await Review.find({ book: bookID }).select(
                "rating"
            );
            console.log(reviews);
            const formattedReview: number[] = reviews.map(
                (review) => review.rating
            );
            console.log(formattedReview);
            const overallReview = getAverageReview(formattedReview);

            console.log(overallReview);
            // storing rating data in book
            const book = await PostBook.findOne({ _id: bookID });
            if (book) {
                book.rating = overallReview;
                await book.save();
            }
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
            isArchived: false,
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
            _id: reviewID,
            isArchived: false,
        });

        if (review) {
            if (review.user.toString() === req.currentUser._id.toString()) {
                const updatedReview = await Review.findOneAndUpdate(
                    { _id: reviewID },
                    {
                        $set: userReview,
                    },
                    { new: true }
                ).populate("user", "fullName email image");
                // calculating average rating
                const reviews = await Review.find({ book: review.book }).select(
                    "rating"
                );
                const formattedReview: number[] = reviews.map(
                    (review) => review.rating
                );
                const overallReview = getAverageReview(formattedReview);

                // storing rating data in book
                const book = await PostBook.findOne({ _id: review.book });
                if (book) {
                    book.rating = overallReview || 1;
                    await book.save();
                }
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.review.reviewUpdated,
                    developerMessage: "",
                    result: updatedReview,
                });
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.review.notAuthorized,
                    developerMessage: "",
                    result: review,
                });
            }
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

// **************** Delete review and rating ****************
export const deleteReviewAndRating = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const reviewID = req?.params?.reviewID;

    try {
        const review = await Review.findOne({
            _id: reviewID,
            isArchived: false,
        });

        if (review) {
            if (review.user.toString() === req.currentUser._id.toString()) {
                review.isArchived = true;
                const updatedReview = await review
                    .save()
                    .then((updatedReview) =>
                        updatedReview
                            .populate("user", "fullName email image")
                            .execPopulate()
                    );
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.review.reviewDeleted,
                    developerMessage: "",
                    result: updatedReview,
                });
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.review.notAuthorized,
                    developerMessage: "",
                    result: review,
                });
            }
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.review.reviewNotFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.review.errorInReviewDelete,
            developerMessage: error.message,
            result: {},
        });
    }
};
