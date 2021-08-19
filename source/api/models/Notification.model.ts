import mongoose from "mongoose";
import { RequestDocument } from "./Request.model";
import { UserDocument } from "./User.model";

export interface NotificationData {
    type: string;
    user: string | UserDocument;
    requestPhoto: string;
    request: string | RequestDocument;
    notificationBody: string;
}

export interface Notification extends NotificationData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["INCOMING_REQUEST", "ACCEPTED", "REJECTED"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        requesterPhoto: {
            type: String,
            required: true,
        },
        request: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        notificationBody: {
            type: String,
            required: true,
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

const Notification = mongoose.model<Notification>(
    "notification",
    notificationSchema
);

export default Notification;
