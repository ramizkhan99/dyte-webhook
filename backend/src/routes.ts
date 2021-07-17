import { Router, Request, Response, response } from "express";
import auth from "./middlewares/auth";
import checkRole from "./middlewares/checkRole";
import User, { UserRole } from "./models/user.model";
import axios from "axios";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
    res.send("This works");
});

// User routes
router.post("/users", async (req: Request, res: Response) => {
    try {
        if (!req.body.username || !req.body.role) {
            throw new Error("Details missing");
        }
        let user = new User(req.body);

        await user.save();
        res.status(201).json({
            message: "User Created",
            id: user.id,
        });
    } catch (err: any) {
        res.status(400).send({
            error: err.message,
        });
    }
});

// Webhook routes
router.post(
    "/",
    // @ts-ignore
    [auth, checkRole(UserRole.ADMIN)],
    async (req: Request, res: Response) => {
        axios
            .post(`${process.env.WEBHOOKS_URI}?targetURL=${req.body.targetURL}`)
            .then((response) => {
                res.status(response.status).json({
                    id: response.data.id,
                });
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                });
            });
    }
);

router.get(
    "/",
    // @ts-ignore
    [auth, checkRole(UserRole.ADMIN)],
    async (req: Request, res: Response) => {
        axios
            .get(`${process.env.WEBHOOKS_URI}`)
            .then((response) => {
                res.status(response.status).json(response.data);
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                });
            });
    }
);

router.put(
    "/",
    // @ts-ignore
    [auth, checkRole(UserRole.ADMIN)],
    async (req: Request, res: Response) => {
        axios
            .put(
                `${process.env.WEBHOOKS_URI}?id=${req.body.id}&newTargetURL=${req.body.newTargetURL}`
            )
            .then((response) => {
                res.status(response.status).json(response.data);
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                });
            });
    }
);

router.delete(
    "/",
    // @ts-ignore
    [auth, checkRole(UserRole.ADMIN)],
    async (req: Request, res: Response) => {
        axios
            .delete(`${process.env.WEBHOOKS_URI}?id=${req.body.id}`)
            .then((response) => {
                res.status(response.status).json(response.data);
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                });
            });
    }
);

router.post("/ip", async (req: Request, res: Response) => {
    axios
        .post(`${process.env.WEBHOOKS_URI}/trigger?ipAddress=${req.ip}`)
        .then((response) => {
            res.status(response.status).json(response.data);
        })
        .catch((err) => {
            res.status(err.response.data.code).json({
                message: err.response.data.message,
            });
        });
});

export default router;
