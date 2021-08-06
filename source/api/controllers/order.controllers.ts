import { Request, Response, NextFunction } from "express";
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Cart from "../models/Cart.model";
import Order from "../models/Order.model";
import { PostBookDocument } from "../models/PostBook.model";
import { getRandomOrderNumber, trimObject } from "../utilities/helperFunctions";

// -------------- View an order -----------------
export const viewOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const orderID = req.query.orderID as string;

    try {
        
        const orderList = await Order.find({})
            .populate("userID", "fullName email image")
            .skip(page * limit - limit)
            .limit(limit);

        const totalOrders = await Order.countDocuments({});

        if (totalOrders > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.order.orderViewed,
                developerMessage: "",
                result: orderList,
                page,
                total: totalOrders,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.order.noOrder,
                developerMessage: "",
                result: [],
                page,
                total: totalOrders,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.order.orderNotViewed,
            developerMessage: error.message,
            result: {},
        });
    }
};

// -------------- Make an order -----------------
export const checkoutOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userID = req.currentUser._id;
        const {
            fullName,
            phoneNumber,
            state,
            city,
            area,
            address,
            coordinates,
            paymentGateway,
        } = req.body;

        // getting cart for order
        const cart = await Cart.findOne({
            userID,
            isArchived: false,
        }).populate("cartItems.book");
        if (cart) {
            // checking if there are no items in cart
            if (cart.cartItems.length <= 0) {
                // return no items in cart
                return res.status(BAD_REQUEST).json({
                    success: true,
                    message: label.cart.emptyCart,
                    developerMessage: "",
                    result: {},
                });
            }
            let orderTotalPrice = 0;
            const orderItems = cart.cartItems.map((item) => {
                const book = item.book as PostBookDocument;
                // calculating total price of order
                orderTotalPrice += item.totalPrice;
                return {
                    bookName: book.name,
                    bookPrice: book.price,
                    bookAuthor: book.author,
                    bookImage: book.images[0],
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                };
            });
            const orderObj = new Order({
                orderID: getRandomOrderNumber(),
                fullName,
                phoneNumber,
                state,
                city,
                area,
                address,
                coordinates,
                paymentGateway,
                orderTotalPrice,
                orderItems,
                userID,
            });
            const order = await orderObj.save();
            // empty the cart after order is placed
            if (order) {
                cart.cartItems = [];
                await cart.save();
            }
            return res.status(CREATED).json({
                success: true,
                message: label.order.orderSuccess,
                developerMessage: "",
                result: order,
            });
        } else {
            res.send("Here");
        }
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
