import { Request, Response, NextFunction } from "express";
import { SUPERUSER_PERMISSION_LEVEL } from "../constants/global.constant";
import { BAD_REQUEST } from "../constants/status-codes.constants";
import label from "../label/label";
import User from "../models/User.model";
import { ErrorType } from "../types/interfaces";
import { encryptPassword } from "../utilities/auth.utilities";
import { editProfileValidation, suspendUserValidation, userValidation } from "../validations/user.validations";

export const validateRegisterBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = userValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};

export const createSuperUser = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = "superuser@accord.com";
        const password = "superuser123";

        const userFound: any = await User.find({ isArchived: false });

        if (userFound) {
            // check if superuser exists
            const user: any = await User.findOne({ email, isArchived: false });
            if (user) {
                next();
            } else {
                const { error: hashedFailed, hash: hashedPassword } =
                    await encryptPassword(password);
                if (!hashedFailed) {
                    if (hashedPassword) {
                        const newUserObj = new User({
                            email,
                            password: hashedPassword,
                            image: "https://res.cloudinary.com/accord/image/upload/v1626935821/test.jpg",
                            fullName: "superuser",
                            permissionLevel: SUPERUSER_PERMISSION_LEVEL,
                            phoneNumber: "9860180332",
                        });
                        const newUser = await newUserObj.save();
                        if (newUser) {
                            next();
                        }
                    }
                }
            }
        } else {
            // create a super user
            const { error: hashedFailed, hash: hashedPassword } =
                await encryptPassword(password);
            if (!hashedFailed) {
                if (hashedPassword) {
                    const newUserObj = new User({
                        email,
                        password: hashedPassword,
                        image: "https://res.cloudinary.com/accord/image/upload/v1626935821/test.jpg",
                        fullName: "superuser",
                        permissionLevel: SUPERUSER_PERMISSION_LEVEL,
                        phoneNumber: "9860180332",
                    });
                    const newUser = await newUserObj.save();
                    if (newUser) {
                        next();
                    }
                }
            }
        }
    } catch (err) {
        res.status(500).json({
            status: "Failure",
            message: label.auth.error,
            developerMessage: err.message,
        });
    }
};

export const validateSuspendUserBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = suspendUserValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};

export const validateEditProfileBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status, message }: ErrorType = editProfileValidation(req.body);

    if (status) {
        res.status(BAD_REQUEST).json({
            success: false,
            message: message,
            developerMessage: message,
            result: [],
        });
    } else {
        next();
    }
};