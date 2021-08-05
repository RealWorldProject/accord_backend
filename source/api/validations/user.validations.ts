import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const userValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("email")) {
        if (isEmpty(data?.email)) {
            error.status = true;
            error.message = label.auth.validation("Email");
        }
        if (!isEmail(data?.email)) {
            error.status = true;
            error.message = label.auth.invalidEmail;
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Email");
    }
    if (data.hasOwnProperty("password")) {
        if (isEmpty(data?.password)) {
            error.status = true;
            error.message = label.auth.validation("password");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Password");
    }
    return error;
};

export const suspendUserValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("suspensionMessage")) {
        if (isEmpty(data?.suspensionMessage)) {
            error.status = true;
            error.message = label.auth.suspensionMessage;
        }
    } else {
        error.status = true;
        error.message = label.auth.suspensionMessage;
    }
    return error;
};
