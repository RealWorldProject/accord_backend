import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmpty, isNumber } from "../utilities/validationFunctions";

export const postBookValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("name")) {
        if (isEmpty(data?.name)) {
            error.status = true;
            error.message = label.postBook.validation("name");
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Name");
    }
    if (data.hasOwnProperty("price")) {
        if (isEmpty(data?.price)) {
            error.status = true;
            error.message = label.postBook.validation("Price");
        }
        if (parseInt(data?.price) <= 0) {
            error.status = true;
            error.message = label.postBook.priceIsZero;
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Price");
    }
    if (data.hasOwnProperty("stock")) {
        if (isEmpty(data?.stock)) {
            error.status = true;
            error.message = label.postBook.validation("Stock");
        }
        if (parseInt(data?.stock) <= 0) {
            error.status = true;
            error.message = label.postBook.stockIsZero;
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Stock");
    }
    if (data.hasOwnProperty("images")) {
        if (data?.images.length < 1) {
            error.status = true;
            error.message = label.postBook.validation("Image");
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Image");
    }
    if (data.hasOwnProperty("description")) {
        if (isEmpty(data?.description)) {
            error.status = true;
            error.message = label.postBook.validation("Description");
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Description");
    }
    if (data.hasOwnProperty("author")) {
        if (isEmpty(data?.author)) {
            error.status = true;
            error.message = label.postBook.validation("Author");
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Author");
    }
    if (data.hasOwnProperty("category")) {
        if (isEmpty(data?.category)) {
            error.status = true;
            error.message = label.postBook.chooseCategory;
        }
    } else {
        error.status = true;
        error.message = label.postBook.validation("Category");
    }

    return error;
};

export const rejectBookValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("rejectionMessage")) {
        if (isEmpty(data?.rejectionMessage)) {
            error.status = true;
            error.message = label.postBook.rejectionMessage;
        }
    } else {
        error.status = true;
        error.message = label.postBook.rejectionMessage;
    }
    return error;
};
