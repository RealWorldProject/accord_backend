import express from "express";
import {
    APPROVE_BOOKS_ROUTE,
    GET_BOOK_STATUS_ROUTE,
    POST_BOOK_ROUTE,
    REJECT_BOOKS_ROUTE,
    VIEW_CATEGORY_BOOKS_ROUTE,
} from "../constants/book.constants";
import {
    postBook,
    getStatusBook,
    acceptBook,
    rejectBook,
    viewBooks,
} from "../controllers/postBook.controllers";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    validatePostBookBody,
    validateRejectBookBody,
} from "../middleware/postBook.middlewares";

const postBookRoutes = express.Router();

// USER ROUTE
postBookRoutes.post(
    POST_BOOK_ROUTE,
    authenticateToken,
    validatePostBookBody,
    postBook
);

// ADMIN ROUTE
postBookRoutes.get(
    GET_BOOK_STATUS_ROUTE,
    authenticateToken,
    isAdmin,
    getStatusBook
);

postBookRoutes.patch(
    APPROVE_BOOKS_ROUTE,
    authenticateToken,
    isAdmin,
    acceptBook
);

postBookRoutes.patch(
    REJECT_BOOKS_ROUTE,
    authenticateToken,
    isAdmin,
    validateRejectBookBody,
    rejectBook
);

postBookRoutes.get(
    VIEW_CATEGORY_BOOKS_ROUTE,
    authenticateToken,
    viewBooks
);

export = postBookRoutes;
