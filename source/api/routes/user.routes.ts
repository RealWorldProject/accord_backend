import express from "express";
import { LOGIN_USER, REGISTER_USER } from "../constants/user.constants";
import { loginUser, registerUser } from "../controllers/user.controllers";
import { validateRegisterBody } from "../middleware/user.middlewares";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER, validateRegisterBody, registerUser);

userRoutes.post(LOGIN_USER,validateRegisterBody, loginUser);

export = userRoutes;
