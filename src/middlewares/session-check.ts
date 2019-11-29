import { Request, Response, NextFunction } from "express";

export function checkAuthToken(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.token) {
        next();
    } else {
        res.redirect('/');
    }
}
