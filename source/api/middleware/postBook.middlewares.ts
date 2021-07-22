import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import { ErrorType } from "../types/interfaces";
import {
    postBookValidation,
    rejectBookValidation,
} from "../validations/postBook.validations";

export const validatePostBookBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = postBookValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};

export const validateRejectBookBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = rejectBookValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};
