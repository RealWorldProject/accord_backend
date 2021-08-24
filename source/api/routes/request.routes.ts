import express from "express";
import {
    ACCEPT_REQUEST,
    DELETE_REQUEST,
    EDIT_REQUEST,
    GET_NOTIFICATIONS,
    INCOMING_REQUEST,
    MY_REQUEST,
    REJECT_REQUEST,
    REQUEST_BOOK,
} from "../constants/request.constants";
import {
    acceptRequest,
    deleteRequest,
    editRequestedBook,
    getNotification,
    incomingRequest,
    myRequest,
    rejectRequest,
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

requestRoutes.patch(ACCEPT_REQUEST, authenticateToken, acceptRequest);

requestRoutes.patch(REJECT_REQUEST, authenticateToken, rejectRequest);

requestRoutes.get(GET_NOTIFICATIONS, authenticateToken, getNotification);

requestRoutes.patch(EDIT_REQUEST, authenticateToken, editRequestedBook);

requestRoutes.delete(DELETE_REQUEST, authenticateToken, deleteRequest);

export = requestRoutes;
