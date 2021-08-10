import mongoose from "mongoose";
import { PostBookDocument } from "./PostBook.model";
import { UserDocument } from "./User.model";

export interface RequestData {
    user: string | UserDocument;
    proposedExchangeBook: string | PostBookDocument;
    requestedBook: string | PostBookDocument;
    requestedBookOwner: string | UserDocument;
    status: string;
}

export interface RequestDocument extends RequestData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const requestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        proposedExchangeBook: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "postBook",
        },
        requestedBook: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "postBook",
        },
        requestedBookOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const RequestBook = mongoose.model<RequestDocument>("request", requestSchema);

export default RequestBook;
