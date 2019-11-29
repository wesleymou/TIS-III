import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/session-check';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    if (req.session && req.session.token) {
        res.redirect('/dashboard')
    } else {
        res.render('index', { layout: false });
    }
});

export default router;
