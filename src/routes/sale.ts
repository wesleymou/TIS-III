import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import SKUService from "../services/SKUService";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductListViewModel from '../models/ProductListViewModel';
import SKU from '../models/SKU';

const temp = new ProductService();
const service = new SKUService();
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: string | undefined = req.query.q;

    const products: Product[] = query
      ? await temp.searchAsync(query)
      : await temp.getAllAsync();

    const viewModel = new ProductListViewModel(products);

    res.render('sale-create', { title: 'Figaro - Estoque', ...viewModel });
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = normalizeSale(req.body);

    if (sale == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await service.createAsync(sale);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

/**
 * Valida e converte um objeto para o tipo Produto.
 * Retorna o produto ou null, se o objeto for inválido.
 * @param obj Objeto que será convertido
 */
function normalizeSale(obj: any): SKU | null {
  const {
    id,
    saleDate,
    expirationDate,
    quantityAvailable
  } = obj;

  if (isNaN(Number(id)) || isNaN(Number(quantityAvailable))) {
    return null;
  }

  const sku: SKU = Object.assign(new SKU, {
    id: id,
    saleDate: new Date(saleDate),
    quantityAvailable: Math.abs(Number(quantityAvailable)),
  });

  const exp = new Date(expirationDate);

  if (exp.valueOf()) {
    sku.expirationDate = exp;
  }

  return sku;
}

router.post('/product', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = normalizeProduct(req.body);

    if (product == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await temp.createAsync(product);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

/**
 * Valida e converte um objeto para o tipo Produto.
 * Retorna o produto ou null, se o objeto for inválido.
 * @param obj Objeto que será convertido
 */
function normalizeProduct(obj: any): Product | null {
  const {
    name,
    code,
    description,
    price,
    saleDate,
    expirationDate,
    quantityAvailable
  } = obj;

  if (!name || isNaN(Number(quantityAvailable)) || isNaN(Number(price))) {
    return null;
  }

  const sku: SKU = Object.assign(new SKU, {
    code: code,
    saleDate: new Date(saleDate),
    quantityAvailable: Math.abs(Number(quantityAvailable))
  });

  const exp = new Date(expirationDate);

  if (exp.valueOf()) {
    sku.expirationDate = exp;
  }

  const SKUList: Array<SKU> = new Array<SKU>(sku);
 
  const product: Product = Object.assign(new Product, {
    name: name,
    code: code,  
    description: description,
    price: Math.abs(Number(price)),
    SKUList: SKUList
  });

  return product;
}

export default router;
