import express from "express";
import { POST_BOOK } from "../constants/book.constants";
import { postBook } from "../controllers/postBook.controllers";

const postBookRoutes = express.Router();

postBookRoutes.post(POST_BOOK, postBook)