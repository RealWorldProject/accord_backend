import { Request, Response, NextFunction } from "express";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
    FORBIDDEN,
    SUCCESS,
    BAD_REQUEST,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Cart from "../models/Cart.model";
import Category from "../models/Category.model";
import Order from "../models/Order.model";
import PostBook, { PostBookDocument } from "../models/PostBook.model";
import User, { userSchema } from "../models/User.model";
import { StockCheck } from "../types/interfaces";
import { getRandomOrderNumber, trimObject } from "../utilities/helperFunctions";

// -------------- View an orders || for admin -----------------
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
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.cart.emptyCart,
                    developerMessage: "",
                    result: {},
                });
            }
            let orderTotalPrice = 0;
            const stockCheck: StockCheck = {
                isSomeBookIsOutOfStock: false,
                bookName: "",
            };
            const orderItems = cart.cartItems.map((item) => {
                const book = item.book as PostBookDocument;
                // checking if the book is out of stock
                if (item.quantity > book.stock) {
                    stockCheck.isSomeBookIsOutOfStock = true;
                    stockCheck.bookName = book.name;
                }
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
            // check for any of of stock books
            if (stockCheck.isSomeBookIsOutOfStock) {
                return res.status(FORBIDDEN).json({
                    success: true,
                    message: label.order.stockNotAvailable(stockCheck.bookName),
                    developerMessage: "",
                    result: {},
                });
            }
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
                // decrease quantity
                cart.cartItems.forEach(async (item) => {
                    const book = item.book as PostBookDocument;
                    // stock check is not required because its already done above
                    const newBook = await book.decreaseQuantity(item.quantity);
                });
                // resetting the cart
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
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.cart.cartNotFound,
                developerMessage: "",
                result: {},
            });
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

// -------------- View an orders || for user -----------------
export const viewMyOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;

    try {
        const orderList = await Order.find({
            userID,
        });
        const totalOrders = await Order.countDocuments({ userID });
        if (orderList.length > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.order.orderViewed,
                developerMessage: "",
                total: totalOrders,
                result: orderList,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.order.emptyOrder,
                developerMessage: "",
                total: totalOrders,
                result: [],
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

// stats
export const getOverallStats = async (req: Request, res: Response) => {
    try {
        const users = await User.countDocuments({ isArchived: false });
        const orders = await Order.countDocuments({ isArchived: false });
        const books = await PostBook.countDocuments({ isArchived: false });
        const pendingBooks = await PostBook.countDocuments({
            isArchived: false,
            status: "PENDING",
        });
        const approvedBooks = await PostBook.countDocuments({
            isArchived: false,
            status: "VERIFIED",
        });
        const rejectedBooks = await PostBook.countDocuments({
            isArchived: false,
            status: "REJECTED",
        });
        const activeUsers = await User.countDocuments({
            isArchived: false,
            isSuspended: false,
        });
        const suspendedUsers = await User.countDocuments({
            isArchived: false,
            isSuspended: true,
        });
        const numberOfBooksAccordingToCategory = await PostBook.aggregate([
            {
                $group: { _id: "$category", Total: { $sum: 1 } },
            },
        ]);
        const booksWithCategoryName = await Promise.all(
            numberOfBooksAccordingToCategory.map(async (data) => {
                const category = await Category.findOne({ _id: data._id });
                return {
                    name: category?.category,
                    number: data.Total,
                };
            })
        );
        const data = {
            orders,
            books,
            bookData: [pendingBooks, approvedBooks, rejectedBooks],
            userData: [activeUsers, suspendedUsers],
            booksWithCategoryName,
        };
        return res.status(SUCCESS).json({
            success: true,
            message: label.order.statFetched,
            developerMessage: "",
            result: data,
        });
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.order.statFetchError,
            developerMessage: error.message,
            result: {},
        });
    }
};
