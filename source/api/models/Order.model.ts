import mongoose from "mongoose";
import { PostBookDocument } from "./PostBook.model";
import { UserDocument } from "./User.model";

export interface OrderData {
    userId: string | UserDocument;
    book: string | PostBookDocument;
    fullName: string;
    phoneNumber: string;
    region: string;
    city: string;
    area: string;
    address: string;
    coordinates: string;
    paymentGateway: string;
}

export interface OrderDocument extends OrderData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "postBook"
        },
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            type: String,
            required: false,
        },
        paymentGateway: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<OrderData>("order", orderSchema);

export default Order;
