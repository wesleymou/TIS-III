import { isArray } from "util";
import { Router } from "express";
import createError from "http-errors";

import SaleService from "../services/SaleService";
import SKUService from "../services/SKUService";

import ProductListViewModel from "../models/ProductListViewModel";
import SKU from "../models/SKU";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";

import { getAllPaymentMethods } from '../models/PaymentMethod';

import { checkAuthToken } from "../middlewares/session-check";

const skuService = new SKUService();
const saleService = new SaleService();

const router = Router();

router.use(checkAuthToken);

router.get("/", async (req, res) => {
  res.render("shopping-cart", {
    title: "Figaro - Registrar Venda",
    paymentMethods: getAllPaymentMethods()
  });
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
    let products: SKU[] = query
      ? await skuService.searchProductAsync(query)
      : [];
    const viewModel = new ProductListViewModel(products);
    res.json(viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

async function validateSale(obj: any): Promise<Sale> {
  const { items, discount } = obj;

  console.log('sale-obj', items)

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

  sale.totalPrice = sale.items.reduce(
    (total, item) => item.priceSold * item.quantity + total,
    0
  );

  sale.paymentMethodId = 1;
  sale.paymentDate = new Date();

  return sale;
}

export default router;
