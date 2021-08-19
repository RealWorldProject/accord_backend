import mongoose from "mongoose";
import { PostBookDocument } from "./PostBook.model";
import { UserDocument } from "./User.model";

export interface ReviewData {
    review: string;
    rating: number;
    book: string | PostBookDocument;
    user: string | UserDocument;
}

export interface ReviewDocument extends ReviewData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            default: 1,
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "postBook",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        isArchived: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model<ReviewDocument>("review", reviewSchema);

export default Review;
