import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
} from "../constants/status-codes.constants";
import label from "../label/label";
import PostBook from "../models/PostBook.model";

// --------- Post a book -----------
export const postBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, price, description, author, userId, category } = req.body;

        const postBookObj = new PostBook({
            name,
            price,
            image: "dummy.png",
            description,
            author,
            userId,
            category,
        });
        const postBook = await postBookObj.save();
        return res.status(CREATED).json({
            success: true,
            message: label.postBook.bookPosted,
            developerMessage: "",
            result: [],
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.postBook.couldNotPostBook,
            developerMessage: error.message,
            result: [],
        });
    }
};
