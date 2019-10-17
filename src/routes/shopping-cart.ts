import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductListViewModel from '../models/ProductListViewModel';
import SKUService from '../services/SKUService';
import ProductViewModel from '../models/ProductViewModel';
import SKU from '../models/SKU';
import { checkAuthToken } from '../middlewares/session-check';

const skuService = new SKUService();

const router = Router();

router.use(checkAuthToken);

router.get('/', async (req, res, next) => {
  try {

    const skuList = await skuService.getAllAsync();
    const viewModel = new ProductListViewModel(skuList);

    res.render('shopping-cart', {
      title: 'Figaro - Estoque',
      product: viewModel.products
    });
  } catch (err) {
    next(createError(500, err));
  }
});

export default router;