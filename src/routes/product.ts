import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import Product from "../models/Product";
import ProductListViewModel from '../models/ProductListViewModel';
import SKUService from '../services/SKUService';
import { createViewModel as createProductViewModel } from '../models/ProductViewModel';
import SKU from '../models/SKU';
import { checkAuthToken } from '../middlewares/session-check';
import Customer from '../models/Customer';
import SKUListViewModel from '../models/SKUListViewModel';

const productService = new ProductService();
const skuService = new SKUService();

const router = Router();

router.use(checkAuthToken);

// Render product list
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: string | undefined = req.query.q;

    const products: Product[] = query
      ? await productService.searchAsync(query)
      : await productService.getAllAsync();

    const viewModel = new ProductListViewModel(products);

    viewModel.title = 'Figaro - Estoque';
    viewModel.setActiveMenu('/product');

    res.render('product-list', viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

// Get product
router.get('/:id', async (req, res, next) => {
  try {
    const id: number = Number(req.params.id);

    const product = await productService.getByIdAsync(id);

    if (!product.id) {
      return res.status(404).send();
    }

    const viewModel = createProductViewModel(product);

    res.json(viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

router.get('/sku/:id', async (req, res, next) => {
  try {
    const id: number = Number(req.params.id);
    const sku = await skuService.getByIdAsync(id);
    res.json(sku);
  } catch (err) {
    next(createError(500, err));
  }
});

// Render sku list
router.get('/view/:id', async (req, res, next) => {
  try {
    const id: number = Number(req.params.id);

    const product = await productService.getByIdAsync(id);

    if (!product.id) {
      return res.status(404).send('404 not found');
    }

    const skuList = await skuService.getByProductAsync(id);
    const listModel = new ProductListViewModel(skuList);
    const viewModel = new SKUListViewModel();

    viewModel.title = 'Figaro - Estoque';
    viewModel.skus = listModel.products;
    viewModel.product = product;

    viewModel.setActiveMenu('/product');

    res.render('sku-list', viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

// Delete product
router.delete('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  await productService.removeAsync(id);
  res.status(200).send();
});

// Delete sku
router.delete('/sku/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  await skuService.removeAsync(id);
  res.status(200).send();
})

// Add product
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = normalizeProduct(req.body);

    if (product == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await productService.createAsync(product);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

// Add sku to product
router.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const sku = normalizeSku(req.body);

    if (isNaN(id) || sku == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    sku.productId = id;

    await skuService.createAsync(sku);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

// Edit product
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const product = req.body;

    const update: any = {};

    if (product.name) {
      update.name = product.name;
    }

    if (product.description) {
      update.description = product.description;
    }

    await productService.updateWithIdAsync(id, update);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

// Edit sku
router.put('/sku/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const update = req.body;

    const sku = await skuService.getByIdAsync(id);

    if (!sku) {
      return res.sendStatus(404);
    }

    const available = Number(update.quantityAvailable);

    if (!isNaN(available)) {

      if (available > sku.quantityPurchased) {
        update.quantityPurchased = available;
      }

      update.quantityAvailable = available;
    }

    const expDate = new Date(update.expirationDate);

    if (expDate.valueOf()) {
      update.expirationDate = expDate;
    }

    await skuService.updateWithIdAsync(id, update);

    res.sendStatus(200);
  } catch (err) {
    next(createError(500, err));
  }
});

/**
 * Valida e converte um objeto para o tipo SKU.
 * Retorna o sku ou null, se o objeto for inválido.
 * @param obj Objeto que será convertido
 */
function normalizeSku(obj: any): SKU | null {
  const {
    price,
    quantityAvailable,
    expirationDate
  } = obj;

  if (!Number(quantityAvailable) || !Number(price)) {
    return null;
  }

  const sku: SKU = Object.assign(new SKU(), {
    price,
    quantityAvailable
  });

  const exp = new Date(expirationDate);
  if (exp.valueOf()) {
    sku.expirationDate = exp;
  }

  return sku;
}

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
    quantityAvailable
  } = obj;

  if (!name) {
    return null;
  }

  const product: Product = Object.assign(new Product, {
    name: name,
    code: code,
    description: description,
    price: Math.abs(Number(price)),
    quantityAvailable: Math.abs(Number(quantityAvailable)),
  });
  return product;
}


export default router;
