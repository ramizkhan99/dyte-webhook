import { Schema, Document, model } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export interface IUserSchema extends Document {
    username: string;
    role: UserRole;
}

let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
    },
});

const User = model<IUserSchema>("User", UserSchema);

export default User;
