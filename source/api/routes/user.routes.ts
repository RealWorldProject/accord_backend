import express from "express";
import { REGISTER_USER } from "../constants/user.constants";
import { registerUser } from "../controllers/user.controllers";
import { validateRegisterBody } from "../middleware/user.middlewares";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER, validateRegisterBody, registerUser);

export = userRoutes;
