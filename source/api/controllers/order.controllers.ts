import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Order from "../models/Order.model";

// -------------- Make an order -----------------
export const makeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    } catch (error) {}
};

// -------------- View an order -----------------
export const viewOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            fullName,
            phoneNumber,
            region,
            city,
            area,
            address,
            coordinates,
            paymentGateway,
        } = req.body;

        const orderObj = new Order({
            fullName,
            phoneNumber,
            region,
            city,
            area,
            address,
            coordinates,
            paymentGateway,
        });
        const order = await orderObj.save();
        return res.status(CREATED).json({
            success: true,
            message: label.order.orderSuccess,
            developerMessage: "",
            result: {},
        });
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.order.orderError,
            developerMessage: error.message,
            result: {},
        });
    }
};
