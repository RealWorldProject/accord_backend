import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import PostBook from "../models/PostBook.model";
import { trimObject } from "../utilities/helperFunctions";

// --------- Post a book -----------
export const postBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            name,
            price,
            images,
            description,
            author,
            category,
            isNew,
            isAvailableForExchange,
        } = req.body;

        const postBookObj = new PostBook({
            name,
            price,
            images,
            description,
            author,
            category,
            isNewBook: isNew,
            isAvailableForExchange,
            status: "PENDING",
            userId: req.currentUser._id,
        });
        const postBook = await postBookObj.save();
        if (postBook) {
            return res.status(CREATED).json({
                success: true,
                message: label.postBook.bookPosted,
                developerMessage: "",
                result: postBook,
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.couldNotPostBook,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const getStatusBook = async (req: Request, res: Response) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;
    const name: string = req?.query.name as string;
    const status: string = req?.query.status as string;
    try {
        const query = {
            isArchived: false,
            name: new RegExp(name, "i"),
            status,
        };
        const books = await PostBook.find(query)
            .populate("category", "category")
            .populate("userId", "fullName email image");
        const totalBooks = await PostBook.countDocuments(query);
        if (totalBooks > 0 && books.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.bookFetch,
                developerMessage: "",
                result: books,
                totalCount: totalBooks,
                page,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.bookFetch,
                developerMessage: "",
                result: [],
                totalCount: totalBooks,
                page,
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.bookFetchError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const acceptBook = async (req: Request, res: Response) => {
    const bookID = req?.params?.bookID;
    try {
        const book = await PostBook.findOne({ isArchived: false, _id: bookID });
        if (book) {
            book.status = "VERIFIED";
            const updatedBook = await book.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.bookVerified,
                developerMessage: "",
                result: updatedBook,
            });
        } else {
            throw new Error(label.postBook.bookVerificationError);
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.bookVerificationError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const rejectBook = async (req: Request, res: Response) => {
    const bookID = req?.params?.bookID;
    try {
        const { rejectionMessage } = req.body;
        const book = await PostBook.findOne({ isArchived: false, _id: bookID });
        if (book) {
            book.status = "REJECTED";
            book.rejectionMessage = rejectionMessage;
            const updatedBook = await book.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.bookRejected,
                developerMessage: "",
                result: updatedBook,
            });
        } else {
            throw new Error(label.postBook.bookRejectionError);
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.bookRejectionError,
            developerMessage: error.message,
            result: {},
        });
    }
};

export const viewBooks = async (req: Request, res: Response) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const categoryID = req?.query?.categoryID as string;
    const searchTerm = req?.query?.searchTerm as string;

    try {
        // trim object remove all the empty field in the object
        const query = trimObject({
            isArchived: false,
            status: "VERIFIED",
            category: categoryID,
            name: new RegExp(searchTerm, "i"),
        });
        const books = await PostBook.find(query)
            .skip(page * limit - limit)
            .limit(limit);
        const totalBooks = await PostBook.countDocuments(query);
        if (books.length > 0 && totalBooks > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.viewBookMessage,
                developerMessage: "",
                result: books,
                page,
                total: totalBooks,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.postBook.noBook,
                developerMessage: "",
                result: [],
                page,
                total: totalBooks,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.couldNotViewBooks,
            developerMessage: error.message,
            result: [],
        });
    }
};
