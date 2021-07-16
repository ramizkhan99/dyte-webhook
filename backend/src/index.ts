import express, { Express, Request, Response } from "express";
import Moleculer from "moleculer";

const PORT = process.env.PORT || 4080;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
    res.json({
        msg: "This is working",
    });
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
