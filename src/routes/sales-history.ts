import { Router } from "express";
import createError from "http-errors";

import SaleService from "../services/SaleService";
import SaleItemService from "../services/SaleItemService";
import CustomerService from "../services/CustomerService";

import SaleDetailViewModel, {
  createSaleDetailViewModel
} from "../models/SaleDetailViewModel";
import SaleItemViewModel, {
  createSaleItemViewModel
} from "../models/SaleItemViewModel";
import SaleItem from "../models/SaleItem";
import { getAllPaymentMethods } from "../models/PaymentMethodViewModel";
import { getAllSaleStatus } from "../models/SaleStatusViewModel";

import { checkAuthToken } from "../middlewares/session-check";
import Sale from "../models/Sale";
import { SaleListViewModel } from "../models/SaleListViewModel";

const saleService = new SaleService();
const saleItemService = new SaleItemService();
const customerService = new CustomerService();

const router = Router();

router.use(checkAuthToken);

router.get("/", async (req, res, next) => {
  try {
    const salesDetailUnformatted = await saleService.getAllAsync();
    const salesDetail: SaleDetailViewModel[] = salesDetailUnformatted.map(
      createSaleDetailViewModel
    );

    const viewModel = new SaleListViewModel();

    viewModel.title = 'Figaro - Historico de vendas';
    viewModel.salesDetail = salesDetail;

    viewModel.setActiveMenu('/sales-history');

    res.render("sales-history", viewModel);
  } catch (error) {
    next(createError(500, error));
  }
});

router.get("/sale-items/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    const saleItemsUnformatted: SaleItem[] = query
      ? await saleItemService.getAllByIdAsync(Number.parseInt(query))
      : [];
    const saleItems: SaleItemViewModel[] = saleItemsUnformatted.map(
      createSaleItemViewModel
    );

    res.send(saleItems);
  } catch (error) {
    next(createError(500, error));
  }
});

router.get("/get-sale/:query", async (req, res) => {
  try {
    const { query } = req.params;
    if (!query)
      return res
        .status(400)
        .send("Aconteceu algum erro. Por favor, tente novamente");

    const saleUnformatted = await saleService.getByIdAsync(
      Number.parseInt(query)
    );

    const sale = createSaleDetailViewModel(saleUnformatted);

    res.status(201).send(sale);
  } catch (err) {
    res.status(400).send("Ocorreu um erro. Tente novamente.");
  }
});

router.get("/get-customer", async (req, res) => {
  try {
    const customerUnformatted = await customerService.getAllAsync();
    res.status(200).send(customerUnformatted);
  } catch (error) {
    res.status(400).send("Ocorreu um erro. Tente novamente.");
  }
});

router.get("/get-payment-methods", async (req, res) => {
  const paymentMethods = getAllPaymentMethods();
  res.status(200).send(paymentMethods);
});

router.get("/get-sales-status", async (req, res) => {
  const salesStatus = getAllSaleStatus();
  res.status(200).send(salesStatus);
});

router.post("/update-sale", async (req, res) => {
  try {
    const { body } = req;

    const sale: Sale = Object.assign(new Sale(), body);

    saleService.updateAsync(sale);
    res.status(200).send("Registro atualizado com sucesso");
  } catch (error) {
    res.status(400).send("Ocorreu um erro. Tente novamente." + error);
  }
});

router.post("/confirm-sale/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    saleService.updateConfirmAsync(Number.parseInt(query));
    res.status(200).send("Registro de venda atualizado");
  } catch (error) {
    res.status(400).send("Ocorreu um erro. Tente novamente.");
  }
});

router.post("/cancel-sale/:query", async (req, res, next) => {
  try {
    throw new Error("Not implemented");
    const { query } = req.params;
    const items: SaleItem[] = query
      ? await saleItemService.getAllByIdAsync(Number.parseInt(query))
      : [];

    // saleItemService.notImplemented(items);

    res.status(200).send("Status da venda alterada para Cancelada");
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
