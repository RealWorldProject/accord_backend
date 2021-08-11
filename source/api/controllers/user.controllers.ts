import e, { Request, Response, NextFunction } from "express";
import {
    ADMIN_PERMISSION_LEVEL,
    USER_PERMISSION_LEVEL,
} from "../constants/global.constant";
import {
    SUCCESS,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    CREATED,
} from "../constants/status-codes.constants";
import label from "../label/label";
import User, { UserDocument } from "../models/User.model";
import {
    decryptPassword,
    encryptPassword,
    generateToken,
} from "../utilities/auth.utilities";
import { trimObject } from "../utilities/helperFunctions";

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
                result: {},
            });
        } else {
            const { error, hash } = await encryptPassword(password);
            if (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: label.auth.couldNotRegisterUser,
                    developerMessage: "",
                    result: {},
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
                    result: {},
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.couldNotRegisterUser,
            developerMessage: error.message,
            result: {},
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
        // console.log(email);
        const userFound = await User.findOne({
            email: email,
            isArchived: false,
        });
        // console.log(userFound);
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
                        result: {},
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: {},
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: {},
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.noUserFound,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: {},
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
        const userFound = await User.findOne({
            email: email,
            permissionLevel: ADMIN_PERMISSION_LEVEL,
            isArchived: false,
        });
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
                        result: {},
                        token: token,
                        permissionLevel: userFound.permissionLevel,
                    });
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: label.auth.noTokenFound,
                        developerMessage: "",
                        result: {},
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({
                    success: false,
                    message: label.auth.emailPasswordError,
                    developerMessage: "",
                    result: {},
                });
            }
        } else {
            // user not found
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: label.auth.notAdmin,
                developerMessage: "",
                result: {},
            });
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.loginError,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ------------ view user profile ----------------------
export const userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;
    try {
        const userProfile = await User.findOne(
            {
                _id: userID,
            },
            { password: 0, permissionLevel: 0, isArchived: 0 }
        );
        // .select("-password");
        return res.status(SUCCESS).json({
            success: true,
            message: label.auth.viewProfileSuccess,
            developerMessage: "",
            result: userProfile,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.viewProfileError,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ---------------- View user -----------------------
export const viewUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page: number = parseInt(req?.query.page as string) || 1;
    const limit: number = parseInt(req?.query.limit as string) || 0;

    const userID = req.query.userID as string;

    try {
        const user = trimObject({
            isArchived: false,
            _id: userID,
            permissionLevel: USER_PERMISSION_LEVEL,
        });
        const userList = await User.find(user)
            .skip(page * limit - limit)
            .limit(limit);
        const totalUsers = await User.countDocuments(user);

        if (totalUsers > 0) {
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.userViewed,
                developerMessage: "",
                result: userList,
                page,
                total: totalUsers,
            });
        } else {
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.noUser,
                developerMessage: "",
                result: [],
                page,
                total: totalUsers,
            });
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.couldNotViewUsers,
            developerMessage: error.message,
            result: [],
        });
    }
};

// ------------ Suspend user ----------------------
export const suspendUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.params.userID;
    try {
        const { suspensionMessage } = req.body;
        const user = await User.findOne({
            isArchived: false,
            _id: userID,
        });
        if (user) {
            if (user.isSuspended === true) {
                // user is already suspended
                return res.status(SUCCESS).json({
                    success: true,
                    message: label.auth.alreadySuspendedUser,
                    developerMessage: "",
                    result: [],
                });
            }
            user.isSuspended = true;
            user.suspensionMessage = suspensionMessage;
            const updatedUser = await user.save();
            const userReturn = {
                _id: updatedUser._id,
                email: updatedUser.email,
            };
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.userSuspendedSuccess,
                developerMessage: "",
                result: userReturn,
            });
        } else {
            throw new Error(label.auth.userSuspensionError);
        }
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.userSuspensionError,
            developerMessage: error.message,
            result: {},
        });
    }
};

// ------------ Edit user profile ----------------------
export const editProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = req.currentUser._id;

    try {
        const userData = trimObject(req.body);
        const user = await User.findOne({
            _id: userID,
            isArchived: false,
            isSuspended: false,
        });

        if (user) {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userID},
                {
                    $set: userData
                },
                {new: true}
            )
            const returnData = {
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                email: updatedUser?.email,
                image: updatedUser?.image,
                phoneNumber: updatedUser?.phoneNumber
            }
            return res.status(SUCCESS).json({
                success: true,
                message: label.auth.profileUpdated,
                developerMessage: "",
                result: returnData,
            });
        } else {
            // sorry
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: label.auth.profileNotUpdated,
            developerMessage: error.message,
            result: {},
        });
    }
};
