import { Request, Response, NextFunction } from "express";
import {
    SUCCESS,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    CREATED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import User from "../models/User.model";
import {
    decryptPassword,
    encryptPassword,
    generateToken,
} from "../utilities/auth.utilities";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { fullName, email, password } = req.body;
        const isUser = await User.findOne({ email, isArchived: false });
        // user exists
        if (isUser) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: label.auth.userAlreadyExists,
                developerMessage: "",
                result: [],
            });
        } else {
            const { error, hash } = await encryptPassword(password);
            if (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: label.auth.couldNotRegisterUser,
                    developerMessage: "",
                    result: [],
                });
            } else {
                const userObj = new User({
                    fullName,
                    email,
                    password: hash,
                    image: "dummy.png",
                });
                const user = await userObj.save();
                return res.status(CREATED).json({
                    success: true,
                    message: label.auth.userRegistered,
                    developerMessage: "",
                    result: [],
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.couldNotRegisterUser,
            developerMessage: error.message,
            result: [],
        });
    }
};

// ---------- login system ----------
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    try {
        console.log(email);
        const userFound = await User.findOne({
            email: email,
            isArchived: false,
        });
        console.log(userFound);
        if (userFound) {
            const plainPassword = password;
            const hashedPassword = userFound.password;
            const passwordMatched = await decryptPassword(
                plainPassword,
                hashedPassword
            );

            if (passwordMatched) {
                const token = generateToken(userFound._id);
                if (token) {
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.auth.loginSuccessful,
                        developerMessage: "",
                        result: [],
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: [],
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: [],
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.noUserFound,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: [],
        });
    }
};
// login for admin
export const loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    try {
        console.log(email);
        const userFound = await User.findOne({
            email: email,
            permissionLevel:0,
            isArchived: false,
        });
        console.log(userFound);
        if (userFound) {
            const plainPassword = password;
            const hashedPassword = userFound.password;
            const passwordMatched = await decryptPassword(
                plainPassword,
                hashedPassword
            );

            if (passwordMatched) {
                const token = generateToken(userFound._id);
                if (token) {
                    return res.status(SUCCESS).json({
                        success: true,
                        message: label.auth.loginSuccessful,
                        developerMessage: "",
                        result: [],
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: [],
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: [],
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.notAdmin,
                developerMessage: "",
                result: [],
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: [],
        });
    }
};

