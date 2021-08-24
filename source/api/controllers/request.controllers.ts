import { Request, Response, NextFunction, request } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import PostBook, { PostBookDocument } from "../models/PostBook.model";
import RequestBook from "../models/Request.model";
import Notification from "../models/Notification.model";
import { UserDocument } from "../models/User.model";
import { trimObject } from "../utilities/helperFunctions";

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
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: label.request.notAuthorize,
                developerMessage: "",
                result: {},
            });
        }
        // tyo book user ko ho ki haina
        if (exchangeBook?.userId.toString() !== user._id.toString()) {
            // book tyo user ko haina
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: label.request.notAuthorize,
                developerMessage: "",
                result: {},
            });
        }
        if (book) {
            if (book.isAvailableForExchange === false) {
                //
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.request.notAvailable,
                    developerMessage: "",
                    result: {},
                });
            }
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
                // returning populated book for frontend

                const newRequest = await RequestBook.findOne({
                    _id: request._id,
                })
                    .populate("user", "image fullName email")
                    .populate("requestedBookOwner", "image fullName email")
                    .populate({
                        path: "proposedExchangeBook",
                        populate: { path: "category userId" },
                    })
                    .populate({
                        path: "requestedBook",
                        populate: { path: "category userId" },
                    });
                res.status(SUCCESS).json({
                    success: true,
                    message: label.request.requestAdded,
                    developerMessage: "",
                    result: newRequest,
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

// --------------- Incoming request ------------------
export const incomingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    try {
        const requestList = await RequestBook.find({
            requestedBookOwner: userID,
        })
            .sort({ createdAt: -1 })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")

            .populate({
                path: "proposedExchangeBook",
                populate: { path: "category userId" },
            })
            .populate({
                path: "requestedBook",
                populate: { path: "category userId" },
            });
        if (requestList.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.requestViewed,
                developerMessage: "",
                result: requestList,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.noRequest,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.requestNotViewed,
            developerMessage: error.message,
            result: {},
        });
    }
};

// --------------- My request ------------------
export const myRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    try {
        const requestList = await RequestBook.find({
            user: userID,
        })
            .sort({ createdAt: -1 })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")
            .populate({
                path: "proposedExchangeBook",
                populate: { path: "category userId" },
            })
            .populate({
                path: "requestedBook",
                populate: { path: "category userId" },
            });
        if (requestList.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.requestViewed,
                developerMessage: "",
                result: requestList,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.noRequest,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.requestNotViewed,
            developerMessage: error.message,
            result: {},
        });
    }
};

// --------------- Accept request ------------------
export const acceptRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestID = req?.params?.requestID;
    try {
        const request = await RequestBook.findOne({ _id: requestID })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")
            .populate({
                path: "proposedExchangeBook",
                populate: { path: "category userId" },
            })
            .populate({
                path: "requestedBook",
                populate: { path: "category userId" },
            });
        if (request) {
            request.status = "ACCEPTED";
            const updatedRequest = await request.save();
            const bookRequestUser = request.user as UserDocument;
            const bookOwner = request.requestedBookOwner as UserDocument;
            const proposedExchangeBook =
                request.proposedExchangeBook as PostBookDocument;
            await proposedExchangeBook.decreaseQuantity(1);
            // delete notification request
            await Notification.deleteOne({
                request: request._id,
                type: "INCOMING_REQUEST",
            });
            // add new notification
            const notificationObj = new Notification({
                type: "ACCEPTED",
                user: bookRequestUser._id,
                requesterPhoto: bookOwner.image,
                request: request._id,
                notificationBody: `${bookOwner.fullName} accept your request for ${proposedExchangeBook.name} book.`,
            });
            const notification = await notificationObj.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.requestAccepted,
                developerMessage: "",
                result: request,
            });
        } else {
            throw new Error(label.request.requestNotAccepted);
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.requestNotAccepted,
            developerMessage: error.message,
            result: {},
        });
    }
};

// --------------- Reject request ------------------
export const rejectRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestID = req?.params?.requestID;
    try {
        const request = await RequestBook.findOne({ _id: requestID })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")
            .populate({
                path: "proposedExchangeBook",
                populate: { path: "category userId" },
            })
            .populate({
                path: "requestedBook",
                populate: { path: "category userId" },
            });
        if (request) {
            request.status = "REJECTED";
            const updatedRequest = await request.save();
            const bookRequestUser = request.user as UserDocument;
            const bookOwner = request.requestedBookOwner as UserDocument;
            const proposedExchangeBook =
                request.proposedExchangeBook as PostBookDocument;
            // delete notification request
            await Notification.deleteOne({
                request: request._id,
                type: "INCOMING_REQUEST",
            });
            // add new notification
            const notificationObj = new Notification({
                type: "REJECTED",
                user: bookRequestUser._id,
                requesterPhoto: bookOwner.image,
                request: request._id,
                notificationBody: `${bookOwner.fullName} reject your request for ${proposedExchangeBook.name} book.`,
            });
            const notification = await notificationObj.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.requestRejected,
                developerMessage: "",
                result: request,
            });
        } else {
            throw new Error(label.request.requestNotRejected);
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.requestNotRejected,
            developerMessage: error.message,
            result: {},
        });
    }
};

// --------------- Get notification ------------------
export const getNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    try {
        const notifications = await Notification.find({
            user: userID,
        }).sort({ createdAt: -1 });
        const totalNotifications = await Notification.countDocuments({
            user: userID,
        });
        if (notifications.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.getNotifications,
                developerMessage: "",
                total: totalNotifications,
                result: notifications,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.request.emptyNotifications,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.didNotGetNotification,
            developerMessage: error.message,
            result: {},
        });
    }
};

// **************** Edit request ****************
export const editRequestedBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestID = req?.params?.requestID;

    try {
        const requestBook = trimObject(req.body);
        const request = await RequestBook.findOne({
            _id: requestID,
            isArchived: false,
        })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")
            .populate("requestedBook");

        const book = await PostBook.findOne({
            _id: req.body.proposedExchangeBook,
        });

        if (request) {
            const requestUser = request.user as UserDocument;
            if (requestUser._id.toString() === req.currentUser._id.toString()) {
                if (book) {
                    if (
                        request.status == "ACCEPTED" ||
                        request.status == "REJECTED"
                    ) {
                        return res.status(BAD_REQUEST).json({
                            success: false,
                            message: label.request.cannotEditRequest,
                            developerMessage: "",
                            result: {},
                        });
                    } else {
                        const updatedRequest =
                            await RequestBook.findOneAndUpdate(
                                { _id: requestID },
                                { $set: requestBook },
                                { new: true }
                            );

                        // add
                        await Notification.deleteOne({ request: request._id });
                        const exchangeBook =
                            request.requestedBook as PostBookDocument;

                        const notificationObj = new Notification({
                            type: "INCOMING_REQUEST",
                            user: book.userId,
                            requesterPhoto: req.currentUser.image,
                            request: request._id,
                            notificationBody: `${req.currentUser.fullName} requested your ${book.name} book, wants to exchange it for ${exchangeBook.name}`,
                        });
                        const notification = await notificationObj.save();

                        return res.status(SUCCESS).json({
                            success: true,
                            message: label.request.requestUpdated,
                            developerMessage: "",
                            result: updatedRequest,
                        });
                    }
                } else {
                    // book not found vanea bad requestr pahti
                    res.status(BAD_REQUEST).json({
                        success: false,
                        message: label.request.noBookFound,
                        developerMessage: "",
                        result: {},
                    });
                }
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.request.notAuthorized,
                    developerMessage: "",
                    result: request,
                });
            }
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.request.errorInEditingRequest,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.errorInEditingRequest,
            developerMessage: error.message,
            result: {},
        });
    }
};

// **************** Delete request ****************
export const deleteRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestID = req?.params?.requestID;
    try {
        const request = await RequestBook.findOne({
            _id: requestID,
            isArchived: false,
        })
            .populate("user", "image fullName email")
            .populate("requestedBookOwner", "image fullName email")
            .populate("proposedExchangeBook")
            .populate("requestedBook");

        if (request) {
            const requestUser = request.user as UserDocument;
            if (requestUser._id.toString() === req.currentUser._id.toString()) {
                if (
                    request.status == "ACCEPTED" ||
                    request.status == "REJECTED"
                ) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: label.request.cannotDeleteRequest,
                        developerMessage: "",
                        result: {},
                    });
                } else {
                    request.isArchived = true;
                    const updatedRequest = await request
                        .save()
                        .then((updatedRequest) =>
                            updatedRequest
                                .populate("user", "image fullName email")
                                .execPopulate()
                        );
                    await Notification.deleteOne({ request: request._id });
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.request.requestDeleted,
                        developerMessage: "",
                        result: updatedRequest,
                    });
                }
            } else {
                return res.status(UNAUTHORIZED).json({
                    success: false,
                    message: label.request.notAuthorized,
                    developerMessage: "",
                    result: request,
                });
            }
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.request.errorInRequestDelete,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.request.errorInRequestDelete,
            developerMessage: error.message,
            result: {},
        });
    }
};
