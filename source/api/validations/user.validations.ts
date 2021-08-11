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

export const editProfileValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("fullName")) {
        if (isEmpty(data?.fullName)) {
            error.status = true;
            error.message = label.auth.validation("fullName");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Full Name");
    }

    if (data.hasOwnProperty("phoneNumber")) {
        if (isEmpty(data?.phoneNumber)) {
            error.status = true;
            error.message = label.auth.validation("phoneNumber");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Phone Number");
    }

    if (data.hasOwnProperty("image")) {
        if (isEmpty(data?.image)) {
            error.status = true;
            error.message = label.auth.validation("image");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Image");
    }
    return error;
};
