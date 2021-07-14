import express from "express";
import { POST_BOOK } from "../constants/book.constants";
import { postBook } from "../controllers/postBook.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";
import { validatePostBookBody } from "../middleware/postBook.middlewares";

const postBookRoutes = express.Router();

postBookRoutes.post(
    POST_BOOK,
    authenticateToken,
    validatePostBookBody,
    postBook
);

export = postBookRoutes;
