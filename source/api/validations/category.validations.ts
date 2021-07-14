import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmpty, isValidCategoryName, isValidSlug } from "../utilities/validationFunctions";

export const categoryValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    }

    if (data.hasOwnProperty("category")) {
        if (isEmpty(data?.category)) {
            error.status = true;
            error.message = label.category.validation("Category");
        } else if (!isValidCategoryName(data?.category)) {
            error.status = true;
            error.message = label.category.invalidCategoryName;
        }
    } else {
        error.status = true;
        error.message = label.category.validation("Category");
    }

    if (data.hasOwnProperty("slug")) {
        if (isEmpty(data?.slug)) {
            error.status = true;
            error.message = label.category.validation("Slug");
        } else if (!isValidSlug(data?.slug)) {
            error.status = true;
            error.message = label.category.invalidSlug;
        }
    } else {
        error.status = true;
        error.message = label.category.validation("Slug");
    }

    return error;
};