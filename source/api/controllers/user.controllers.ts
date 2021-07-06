import { Request, Response, NextFunction } from "express";
import { SUCCESS, BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED } from "../constants/status-codes.constants";
import label from "../label/label";
import User from "../models/User.model";
import { encryptPassword } from "../utilities/auth.utilities";


export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
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
