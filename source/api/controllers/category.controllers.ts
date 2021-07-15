import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { errorMonitor } from "stream";
import { VIEW_CATEGORY } from "../constants/category.constants";
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

export const viewCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryList = await Category.find();
        if (categoryList.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.viewAllCategories,
                developerMessage: "",
                result: categoryList,
                total: categoryList.length,
            });
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.category.emptyCategory,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.viewCategoriesError,
            developerMessage: "",
            result: [],
        });
    }
};