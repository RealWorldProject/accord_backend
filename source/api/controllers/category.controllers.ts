import { Request, Response } from "express";
import {
    SUCCESS,
    INTERNAL_SERVER_ERROR,
    CREATED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Category from "../models/Category.model";

// ************************ADD CATEGORY****************************
export const addCategory = async (req: Request, res: Response) => {
    const { category, slug, image } = req.body;

    try {
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
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotAddCategory,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ************************VIEW CATEGORY****************************
export const viewCategory = async (req: Request, res: Response) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    try {
        const categoryList = await Category.find({ isArchived: false })
            .skip(page * limit - limit)
            .limit(limit);
        const totalCategories = await Category.countDocuments({
            isArchived: false,
        });

        if (totalCategories > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.viewAllCategories,
                developerMessage: "",
                result: categoryList,
                page,
                total: totalCategories,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.emptyCategory,
                developerMessage: "",
                result: [],
                page,
                total: totalCategories,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotViewCategories,
            developerMessage: error.message,
            result: [],
        });
    }
};

// ************************UPDATE CATEGORY****************************
export const updateCategory = async (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;
    const { category, slug, image } = req.body;

    try {
        const currentCategory = await Category.findOne({
            _id: categoryID,
            isArchived: false,
        });

        if (currentCategory) {
            currentCategory.category = category;
            currentCategory.slug = slug;
            currentCategory.image = image;
            const updatedCategory = await currentCategory.save();

            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryUpdated,
                developerMessage: "",
                result: updatedCategory,
            });
        } else {
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.category.categoryNotFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotUpdateCategory,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ************************DELETE CATEGORY****************************
export const deleteCategory = async (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;

    try {
        const selectedCategory = await Category.findOne({
            _id: categoryID,
            isArchived: false,
        });

        if (selectedCategory) {
            selectedCategory.isArchived = true;
            const deletedCategory = await selectedCategory.save();
            return res.status(SUCCESS).json({
                success: true,
                message: label.category.categoryDeleted,
                developerMessage: "",
                result: deletedCategory,
            });
        } else {
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.category.categoryNotFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.category.couldNotDeleteCategory,
            developerMessage: error.message,
            result: {},
        });
    }
};
