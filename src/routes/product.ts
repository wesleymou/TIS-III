import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductListViewModel from '../models/ProductListViewModel';

const service = new ProductService();
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Product[] = await service.getAllAsync();

        const viewModel = new ProductListViewModel(products);

        // res.json({ title: 'Figaro - Estoque', ...viewModel });
        res.render('product-list', { title: 'Figaro - Estoque', ...viewModel });
    } catch (err) {
        next(createError(500, err));
    }
});

export default router;
