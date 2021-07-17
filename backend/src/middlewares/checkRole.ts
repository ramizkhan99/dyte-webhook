import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user.model";
import { IAuthRequest } from "./auth";

const checkRole = (role: UserRole) => {
    return async (req: IAuthRequest, res: Response, next: NextFunction) => {
        try {
            if (req.user["role"] !== role) {
                console.log(req.user);
                console.log(role);
                throw new Error("Invalid permission level");
            }
            next();
        } catch (err: any) {
            res.status(401).json({
                error: err.message,
            });
        }
    };
};

export default checkRole;
