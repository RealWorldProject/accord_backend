import express from "express";
import {
    INCOMING_REQUEST,
    MY_REQUEST,
    REQUEST_BOOK,
} from "../constants/request.constants";
import {
    incomingRequest,
    myRequest,
    requestBook,
} from "../controllers/request.controllers";
import { authenticateToken } from "../middleware/authentication.middleware";
import { validateRequestBody } from "../middleware/request.middleware";

const requestRoutes = express.Router();

requestRoutes.post(
    REQUEST_BOOK,
    authenticateToken,
    validateRequestBody,
    requestBook
);

requestRoutes.get(INCOMING_REQUEST, authenticateToken, incomingRequest);

requestRoutes.get(MY_REQUEST, authenticateToken, myRequest);
export = requestRoutes;
