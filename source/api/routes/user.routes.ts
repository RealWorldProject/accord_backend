import express from "express";
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGIN_ADMIN,
    USER_PROFILE,
    SUSPEND_USER,
    VIEW_USERS,
    EDIT_PROFILE,
    CHANGE_PASSWORD_ROUTE,
} from "../constants/user.constants";
import {
    changePassword,
    editProfile,
    loginAdmin,
    loginUser,
    registerUser,
    suspendUser,
    userProfile,
    viewUsers,
} from "../controllers/user.controllers";
import {
    authenticateToken,
    isAdmin,
} from "../middleware/authentication.middleware";
import {
    createSuperUser,
    validateEditProfileBody,
    validateRegisterBody,
    validateSuspendUserBody,
} from "../middleware/user.middlewares";

const userRoutes = express.Router();

userRoutes.post(REGISTER_USER, validateRegisterBody, registerUser);

userRoutes.post(LOGIN_USER, validateRegisterBody, loginUser);

userRoutes.post(LOGIN_ADMIN, validateRegisterBody, createSuperUser, loginAdmin);

userRoutes.get(USER_PROFILE, authenticateToken, userProfile);

userRoutes.get(VIEW_USERS, authenticateToken, isAdmin, viewUsers);

userRoutes.patch(
    SUSPEND_USER,
    authenticateToken,
    isAdmin,
    validateSuspendUserBody,
    suspendUser
);

userRoutes.patch(EDIT_PROFILE, authenticateToken, editProfile);

userRoutes.patch(CHANGE_PASSWORD_ROUTE, authenticateToken, changePassword);
export = userRoutes;
