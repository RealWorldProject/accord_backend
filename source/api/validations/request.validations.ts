import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmpty } from "../utilities/validationFunctions";

export const requestValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("proposedExchangeBook")) {
        if (isEmpty(data?.proposedExchangeBook)) {
            error.status = true;
            error.message = label.request.validation("Proposed ExchangeBook");
        }
    } else {
        error.status = true;
        error.message = label.request.validation("ProposedExchangeBook");
    }

    if (data.hasOwnProperty("requestedBook")) {
        if (isEmpty(data?.requestedBook)) {
            error.status = true;
            error.message = label.request.validation("Requested Book");
        }
    } else {
        error.status = true;
        error.message = label.request.validation("RequestedBook");
    }

    return error;
};
