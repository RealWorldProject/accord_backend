import express from "express";
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGIN_ADMIN,
} from "../constants/user.constants";
import {
    loginAdmin,
    loginUser,
    registerUser,
} from "../controllers/user.controllers";
import {
    createSuperUser,
    validateRegisterBody,
} from "../middleware/user.middlewares";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER, validateRegisterBody, registerUser);

userRoutes.post(LOGIN_USER, validateRegisterBody, loginUser);

userRoutes.post(LOGIN_ADMIN, validateRegisterBody, createSuperUser, loginAdmin);

export = userRoutes;
