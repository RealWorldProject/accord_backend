import mongoose from "mongoose";
import { PostBookDocument } from "./PostBook.model";
import { UserDocument } from "./User.model";

// to retrieve each
type cartBooks = {
    bookName: string;
    bookPrice: number;
    bookAuthor: string;
    bookImage: string;
    quantity: number;
    totalPrice: number;
};

export interface OrderData {
    userID: string | UserDocument;
    orderItems: cartBooks[];
    orderID: string;
    fullName: string;
    phoneNumber: string;
    state: string;
    city: string;
    area: string;
    address: string;
    coordinates: string;
    paymentGateway: string;
    orderTotalPrice: number;
}

export interface OrderDocument extends OrderData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const orderSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        orderID: {
            type: String,
            required: true,
        },
        orderItems: [
            {
                bookName: {
                    type: String,
                    required: false,
                },
                bookPrice: {
                    type: Number,
                    required: false,
                },
                bookAuthor: {
                    type: String,
                    required: false,
                },
                bookImage: {
                    type: String,
                    required: false,
                },
                quantity: {
                    type: Number,
                    required: false,
                    default: 1,
                },
                totalPrice: {
                    type: Number,
                },
            },
        ],
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        state: {
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
            enum: ["COD"],
            default: "COD",
        },
        orderTotalPrice: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<OrderData>("order", orderSchema);

export default Order;
