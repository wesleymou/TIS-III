import { isArray } from "util";
import { Router } from "express";
import createError from "http-errors";

import SaleService from "../services/SaleService";
import SKUService from "../services/SKUService";

import ProductListViewModel from "../models/ProductListViewModel";
import SKU from "../models/SKU";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";

import { getAllPaymentMethods } from '../models/PaymentMethodViewModel';

import { checkAuthToken } from "../middlewares/session-check";
import ShoppingCartViewModel from "../models/ShoppingCartViewModel";

const anonId = Number(process.env.ANON_ID) || 2;

const skuService = new SKUService();
const saleService = new SaleService();

const router = Router();

router.use(checkAuthToken);

router.get("/", async (req, res) => {
  const viewModel = new ShoppingCartViewModel();

  viewModel.title = 'Figaro - Registrar Venda';
  viewModel.paymentMethods = getAllPaymentMethods();
  viewModel.setActiveMenu('/shopping-cart');

  res.render("shopping-cart", viewModel);
});

router.post("/", async (req, res, next) => {
  try {
    let sale;

    try {
      sale = await validateSale(req.body);
    } catch (err) {
      return res.status(400).send(err.message);
    }

    await saleService.createAsync(sale);
    res.status(201).send("OK");
  } catch (err) {
    return next(createError(500, err));
  }
});

router.get("/:query", async (req, res, next) => {
  try {
    const { query } = req.params;

    const products: SKU[] = query
      ? await skuService.searchProductAsync(query)
      : [];

    // não mostrar produtos vencidos
    const viableProducts = products
      .filter(p => !p.expirationDate || p.expirationDate.valueOf() > Date.now());

    const viewModel = new ProductListViewModel(viableProducts);
    res.json(viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

async function validateSale(obj: any): Promise<Sale> {
  const { items, discount, paymentMethodId, customerId, paymentDate } = obj;

  const normalDiscount = Math.abs(Number(discount));

  if (
    !isArray(items) ||
    !items.length ||
    isNaN(normalDiscount) ||
    normalDiscount > 100
  ) {
    throw new Error("Informações inválidas!");
  }

  if (
    items.some(
      (item: SaleItem) => !Number(item.skuId) || !Number(item.quantity)
    )
  ) {
    throw new Error("Itens inválidos!");
  }

  const skus = await skuService.searchByIdAsync(items.map(i => i.skuId));

  if (skus.length !== items.length) {
    throw new Error("Itens não encontrados!");
  }

  const quantityUnavailable = skus.some(sku => {
    const item = items.find(i => i.skuId == sku.id);
    return sku.quantityAvailable < item.quantity;
  });

  if (quantityUnavailable) {
    throw new Error("Produto fora de estoque!");
  }

  const sale = new Sale();

  sale.discount = normalDiscount / 100;

  sale.items = skus.map(sku =>
    Object.assign(new SaleItem(), {
      skuId: sku.id,
      name: sku.name,
      description: sku.description,
      expirationDate: sku.expirationDate,
      price: sku.price,
      quantity: items.find(i => i.skuId == sku.id).quantity,
      priceSold: sku.price * (1 - sale.discount)
    })
  );

  sale.totalPrice = sale.items
    .reduce((total, item) => item.priceSold * item.quantity + total, 0);

  // Deve receber no formato ISO
  sale.paymentDate = new Date(paymentDate || Date.now());

  if (sale.paymentDate.valueOf() > Date.now()) {
    sale.saleStatus = 1 // pendente
  } else {
    sale.saleStatus = 3 // finalizada
  }

  sale.customerId = Number(customerId) || anonId;

  sale.paymentMethodId = paymentMethodId || 1;

  return sale;
}

export default router;
