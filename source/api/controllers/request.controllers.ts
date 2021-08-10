import { Request, Response, NextFunction, request } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import PostBook from "../models/PostBook.model";
import RequestBook from "../models/Request.model";
import Notification from "../models/Notification.model";

// -------------- Request a book -------------------
export const requestBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.currentUser;
        const { proposedExchangeBook, requestedBook } = req.body;
        // get the requested book
        const book = await PostBook.findOne({
            _id: requestedBook,
            isArchived: false,
        });
        // proposed exchange book
        const exchangeBook = await PostBook.findOne({
            _id: proposedExchangeBook,
            isArchived: false,
        });
        if (!exchangeBook) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.request.notAuthorize,
                developerMessage: "",
                result: {},
            });
        }
        // tyo book user ko ho ki haina
        if (exchangeBook?.userId.toString() !== user._id.toString()) {
            // book tyo user ko haina
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.request.notAuthorize,
                developerMessage: "",
                result: {},
            });
        }
        if (book) {
            const requestObj = new RequestBook({
                user: user._id,
                proposedExchangeBook,
                requestedBook,
                requestedBookOwner: book.userId,
            });
            const request = await requestObj.save();
            if (request) {
                // add
                const notificationObj = new Notification({
                    type: "INCOMING_REQUEST",
                    user: book.userId,
                    requesterPhoto: user.image,
                    request: request._id,
                    notificationBody: `${user.fullName} requested your ${book.name} book, wants to exchange it for ${exchangeBook.name}`,
                });
                const notification = await notificationObj.save();
                // return
                res.status(SUCCESS).json({
                    success: true,
                    message: label.request.requestAdded,
                    developerMessage: "",
                    result: request,
                });
            }
        } else {
            // book xaina
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.request.noBookFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.requestError,
            developerMessage: error.message,
            result: {},
        });
    }
};
