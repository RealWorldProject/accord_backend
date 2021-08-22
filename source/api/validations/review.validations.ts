import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmpty, isNumber } from "../utilities/validationFunctions";

export const reviewValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("review")) {
        if (isEmpty(data?.review)) {
            error.status = true;
            error.message = label.review.validation("Review");
        }
    } else {
        error.status = true;
        error.message = label.review.validation("Review");
    }

    if (data.hasOwnProperty("rating")) {
        if (isEmpty(data?.rating)) {
            error.status = true;
            error.message = label.review.validation("Rating");
        }
    } else {
        error.status = true;
        error.message = label.review.validation("Rating");
    }
    return error;
};
