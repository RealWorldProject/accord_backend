import mongoose, { ObjectId } from "mongoose";
import { CategoryDocument } from "./Category.model";
import { UserDocument } from "./User.model";

export interface PostBookData {
    name: string;
    price: number;
    images: string[];
    description: string;
    author: string;
    userId: string | UserDocument;
    category: string | CategoryDocument;
    status: string;
    stock: number;
    rating: number;
    isNewBook: boolean;
    isAvailableForExchange: boolean;
    rejectionMessage: string;
}

export interface PostBookDocument extends PostBookData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    decreaseQuantity(decreaseBy: number): Promise<PostBookDocument>;
}

export const postBookSchema = new mongoose.Schema<PostBookDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        images: [String],
        description: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["VERIFIED", "REJECTED", "PENDING"],
            default: "PENDING",
            required: true,
        },
        isNewBook: {
            type: Boolean,
            required: true,
        },
        isAvailableForExchange: {
            type: Boolean,
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
            required: true,
            ref: "category",
        },
        stock: {
            type: Number,
            required: true,
            default: 1,
        },
        rejectionMessage: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

postBookSchema.methods.decreaseQuantity = async function (
    decreaseBy: number
): Promise<PostBookDocument> {
    const currentStock = this.stock;
    const newStock = currentStock - decreaseBy;
    this.stock = newStock;
    return this.save();
};

const PostBook = mongoose.model<PostBookDocument>("postBook", postBookSchema);

export default PostBook;
