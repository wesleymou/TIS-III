import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductViewModel from '../models/ProductViewModel';

const service = new ProductService();
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Product[] = await service.getAllAsync();
        res.render('products', {
            title: 'Figaro - Estoque',
            products: products.map(p => new ProductViewModel(p))
        });
    } catch (err) {
        next(createError(500, err));
    }
});

export default router;