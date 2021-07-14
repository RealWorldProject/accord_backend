import { error } from "console";
import { Request, Response, NextFunction } from "express";
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
        const categoryExists = await Category.findOne({ category, isArchived: false });
        const slugExists = await Category.findOne({ slug, isArchived: false });
        // checking if category label exists
        if (categoryExists) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.category.categoryNameAlreadyExists,
                developerMessage: "",
                result: [],
            })
        }
        // checking if slug label exists
        else if (slugExists) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.category.slugAlreadyExists,
                developerMessage: "",
                result: [],
            })
        } else {
            const categoryObj = new Category({
                category,
                slug,
                image,
            }).save();
            return res.status(CREATED).json({
                success: true,
                message: label.category.categoryAdded,
                developerMessage: "",
                result: [],
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotAddCategory,
            developerMessage: error.message,
            result: [],
        })
    }
};