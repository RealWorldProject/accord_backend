import express from "express";
import { REQUEST_BOOK } from "../constants/request.constants";
import { requestBook } from "../controllers/request.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";
import { validateRequestBody } from "../middleware/request.middleware";

const requestRoutes = express.Router();

requestRoutes.post(
    REQUEST_BOOK,
    authenticateToken,
    validateRequestBody,
    requestBook
);

export = requestRoutes;
