import mongoose, { ObjectId } from "mongoose";

export interface PostBookData {
    name: string;
    price: number;
    image: string;
    description: string;
    author: string;
    userId: ObjectId;
    category: ObjectId;
}

export interface PostBookDocument extends PostBookData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const postBookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        isArchived: {
            type: Boolean,
            required: true,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "category",
        },
    },
    {
        timestamps: true,
    }
);

const PostBook = mongoose.model<PostBookDocument>("postBook", postBookSchema);

export default PostBook;
