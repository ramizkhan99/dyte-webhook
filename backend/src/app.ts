import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./db";

import router from "./routes";

const PORT = process.env.PORT || 4080;
const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

export default app;
