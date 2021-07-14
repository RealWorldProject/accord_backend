import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import label from "../label/label";
import Category from "../models/Category.model";
import { ErrorType } from "../types/interfaces";
import { categoryValidation } from "../validations/category.validations";

export const validateCategoryBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = categoryValidation(req.body);

    if (status) {
        return res.status(BAD_REQUEST).json({
            status: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};

export const checkCategoryUniqueness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, slug } = req.body;
    const categoryExists = await Category.findOne({ category });
    const slugExists = await Category.findOne({ slug });
    if (categoryExists) {
        const categoryExistsMessage = label.category.categoryNameAlreadyExists;
        return res.status(BAD_REQUEST).json({
            success: false,
            message: categoryExistsMessage,
            developerMessage: categoryExistsMessage,
            result: {},
        });
    } else if (slugExists) {
        const slugExistsMessage = label.category.slugAlreadyExists;
        return res.status(BAD_REQUEST).json({
            success: false,
            message: slugExistsMessage,
            developerMessage: slugExistsMessage,
            result: {},
        });
    } else {
        next();
    }
}