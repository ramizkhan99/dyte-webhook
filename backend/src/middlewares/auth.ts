import { Request, Response, NextFunction } from "express";
import User, { IUserSchema } from "../models/user.model";

export interface IAuthRequest extends Request {
    user: IUserSchema;
}

const auth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        // TODO: Add token for persistent connections
        const user = await User.findOne({
            username: req.body.username,
        });
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err: any) {
        res.status(401).json({
            error: err.message,
        });
    }
};

export default auth;
