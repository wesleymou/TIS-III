import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductListViewModel from '../models/ProductListViewModel';

const service = new ProductService();
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: string | undefined = req.query.q;

    const products: Product[] = query
      ? await service.searchAsync(query)
      : await service.getAllAsync();

    const viewModel = new ProductListViewModel(products);

    res.render('sale-create', { title: 'Figaro - Estoque', ...viewModel });
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = normalizeProduct(req.body);

    if (product == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await service.createAsync(product);

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
    expirationDate,
    quantityAvailable
  } = obj;

  if (!name || isNaN(Number(quantityAvailable)) || isNaN(Number(price))) {
    return null;
  }

  const product: Product = Object.assign(new Product, {
    name: name,
    code: code,
    description: description,
    price: Math.abs(Number(price)),
    quantityAvailable: Math.abs(Number(quantityAvailable)),
  });

  const exp = new Date(expirationDate);

  if (exp.valueOf()) {
    product.expirationDate = exp;
  }

  return product;
}


export default router;
