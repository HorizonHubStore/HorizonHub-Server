import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeaders = req.headers["authorization"];
        const token = authHeaders && authHeaders.split(" ")[1];
        
        if (token == null) {
            return res.sendStatus(401); // Unauthorized
        }
        const accessTokenSecret: string = process.env
            .ACCESS_TOKEN_SECRET as string;
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.status(403).send(err.message);
            }

            // @ts-ignore
            req.user = user;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500); // Internal Server Error
    }
};

export default authenticate;
