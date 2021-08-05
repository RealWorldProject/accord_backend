import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmpty, isPhoneNumber } from "../utilities/validationFunctions";

export const orderValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("fullName")) {
        if (isEmpty(data?.fullName)) {
            error.status = true;
            error.message = label.order.validation("Full Name");
        }
    } else {
        error.status = true;
        error.message = label.order.validation("Full Name");
    }

    if (data.hasOwnProperty("phoneNumber")) {
        if (isEmpty(data?.phoneNumber)) {
            error.status = true;
            error.message = label.order.validation("Phone Number");
            if (!isPhoneNumber(data?.phoneNumber)) {
                error.status = true;
                error.message = label.order.invalidPhoneNumber;
            }
        }
    } else {
        error.status = true;
        error.message = label.order.validation("Phone Number");
    }

    if (data.hasOwnProperty("state")) {
        if (isEmpty(data?.state)) {
            error.status = true;
            error.message = label.order.validation("State");
        }
    } else {
        error.status = true;
        error.message = label.order.validation("State");
    }

    if (data.hasOwnProperty("city")) {
        if (isEmpty(data?.city)) {
            error.status = true;
            error.message = label.order.validation("City");
        }
    } else {
        error.status = true;
        error.message = label.order.validation("City");
    }

    if (data.hasOwnProperty("area")) {
        if (isEmpty(data?.area)) {
            error.status = true;
            error.message = label.order.validation("Area");
        }
    } else {
        error.status = true;
        error.message = label.order.validation("Area");
    }

    if (data.hasOwnProperty("address")) {
        if (isEmpty(data?.address)) {
            error.status = true;
            error.message = label.order.validation("Address");
        }
    } else {
        error.status = true;
        error.message = label.order.validation("Address");
    }

    if (data.hasOwnProperty("paymentGateway")) {
        // data xa
        if (isEmpty(data?.paymentGateway)) {
            error.status = true;
            error.message = label.order.selectPaymentGateway;
        }
    } else {
        // data xaina
        error.status = true;
        error.message = label.order.validation("Payment Gateway");
    }
    return error;
};
