import { Request, Response, NextFunction } from "express";
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    SUCCESS,
} from "../constants/status-codes.constants";
import label from "../label/label";
import Cart from "../models/Cart.model";
import PostBook, { PostBookDocument } from "../models/PostBook.model";

// -------------------- Add Book to cart -----------------------
export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    const bookId = req.body.bookID;
    const bookQuantity = req.body.quantity;

    try {
        let isBook = true;
        let isBookAdded = false;
        // get the cart
        const cart = await Cart.findOne({ userID, isArchived: false });
        // get the book
        const book = await PostBook.findOne({
            _id: bookId,
            isArchived: false,
        });

        if (!book) isBook = false;
        if (cart) {
            // add the product
            if (book) {
                let totalPrice = Math.round(bookQuantity * book?.price);

                const addedBookToCart = await cart.addToCart(
                    bookId,
                    bookQuantity,
                    totalPrice
                );
                isBookAdded = true;
            }
        } else {
            // create the cart and then add the product
            const newCart = new Cart({ userID });
            const userCart: any = await newCart.save();
            //
            // add the book
            if (book) {
                let totalPrice = Math.round(bookQuantity * book?.price);

                const addedBookToCart = await userCart.addToCart(
                    bookId,
                    bookQuantity,
                    totalPrice
                );
                isBookAdded = true;
            }
        }
        if (!isBook) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.cart.noBookFound(bookId),
                developerMessage: " ",
                result: [],
            });
        }
        if (isBookAdded) {
            // retrieve new cart
            const newCart = await Cart.findOne({
                userID: userID,
                isArchived: false,
            }).populate("cartItems.book");
            if (newCart) {
                const trimmedCart = newCart.cartItems.map((item) => {
                    const book = item.book as PostBookDocument;
                    return {
                        _id: book.id,
                        name: book.name,
                        images: book.images[0],
                        price: book.price,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                    };
                });
                res.status(SUCCESS).json({
                    success: true,
                    message: label.cart.booksAddedToCart,
                    developerMessage: " ",
                    cartID: newCart._id,
                    result: trimmedCart,
                });
            }
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.cart.couldNotAddBooksToCart,
                developerMessage: " ",
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.cart.couldNotAddBooksToCart,
            systemMessage: error.message,
            developerMessage: error.message,
            result: [],
        });
    }
};

// ----------------------- View cart books -----------------------------
export const viewCartBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    try {
        const cart = await Cart.findOne({
            userID: userID,
            isArchived: false,
        }).populate("cartItems.book");

        if (cart) {
            if (cart.cartItems.length > 0) {
                const trimmedCart = cart.cartItems.map((item) => {
                    const book = item.book as PostBookDocument;
                    return {
                        _id: book.id,
                        name: book.name,
                        images: book.images[0],
                        price: book.price,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                    };
                });
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.cart.viewCartBooks,
                    developerMessage: " ",
                    cartId: cart._id,
                    result: trimmedCart,
                });
            } else {
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.cart.emptyCart,
                    cartId: null,
                    result: [],
                });
            }
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.cart.emptyCart,
                cartId: null,
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.cart.couldNotViewCartBooks,
            systemMessage: error.message,
            developerMessage: error.message,
            result: [],
        });
    }
};

// ----------------------- Remove cart books -----------------------------
export const deleteCartBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    const bookId = req.body.bookID;

    try {
        const bookFound = await PostBook.findOne({
            _id: bookId,
            isArchived: false,
        });

        console.log(bookFound)

        if (bookFound) {
            const cartFound = await Cart.findOne({
                userID: userID,
                isArchived: false,
            });
            if (cartFound) {
                let cartProductIndex = -1;
                cartProductIndex = cartFound.cartItems.findIndex(
                    (item) => bookId == item.book
                );

                if (cartProductIndex >= 0) {
                    const cartItems = [...cartFound.cartItems];
                    const newCartItems = cartItems.filter(
                        (item) => bookId != item.book
                    );
                    cartFound.cartItems = newCartItems;
                    const updatedCart = await cartFound.save();
                    const cart = await Cart.findOne({
                        userID: userID,
                        isArchived: false,
                    });
                    const trimmedCart = cart?.cartItems.map((item) => {
                        const book = item.book as PostBookDocument;
                        return {
                            _id: book.id,
                            name: book.name,
                            images: book.images[0],
                            price: book.price,
                            quantity: item.quantity,
                            totalPrice: item.totalPrice,
                        };
                    });
                    if (updatedCart) {
                        res.status(SUCCESS).json({
                            success: true,
                            message: label.cart.removeCartBookSuccess,
                            developerMessage: " ",
                            result: trimmedCart,
                        });
                    } else {
                        res.status(BAD_REQUEST).json({
                            success: false,
                            message: label.cart.removeCartBookError,
                            developerMessage: " ",
                            result: [],
                        });
                    }
                } else {
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.cart.emptyCart,
                        cartId: null,
                        result: [],
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.cart.cartNotFound,
                    developerMessage: " ",
                    result: [],
                });
            }
        } else {
            res.status(BAD_REQUEST).json({
                success: false,
                message: label.cart.bookNotFound,
                developerMessage: " ",
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.cart.removeCartBookError,
            systemMessage: error.message,
            developerMessage: error.message,
            result: [],
        });
    }
};
