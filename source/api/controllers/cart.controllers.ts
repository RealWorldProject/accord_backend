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
        });
    }
};
