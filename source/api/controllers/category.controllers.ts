import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { errorMonitor } from "stream";
import { SUCCESS, 
    INTERNAL_SERVER_ERROR, 
    CREATED, 
    BAD_REQUEST,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Category from "../models/Category.model";

// *****ADD CATEGORY*****
export const addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category, slug, image } = req.body;

        const categoryObj = new Category({
            category,
            slug,
            image,
        });
        const newCategory = await categoryObj.save();
        if (newCategory) {
            return res.status(CREATED).json({
                success: true,
                message: label.category.categoryAdded,
                developerMessage: "",
                result: newCategory,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotAddCategory,
            developerMessage: error.message,
            result: {},
        });
    }
};