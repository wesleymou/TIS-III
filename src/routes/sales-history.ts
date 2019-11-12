import { Router } from "express";
import createError from "http-errors";

import SaleService from "../services/SaleService";
import SaleItemService from "../services/SaleItemService";

import SaleDetailViewModel, {
  createSaleDetailViewModel
} from "../models/SaleDetailViewModel";
import SaleItemViewModel, {
  createSaleItemViewModel
} from "../models/SaleItemViewModel";

import { checkAuthToken } from "../middlewares/session-check";
import SaleItem from "../models/SaleItem";

const saleService = new SaleService();
const saleItemService = new SaleItemService();

const router = Router();

router.use(checkAuthToken);

router.get("/", async (req, res, next) => {
  try {
    const salesDetailUnformatted = await saleService.getAllAsync();
    const salesDetail: SaleDetailViewModel[] = salesDetailUnformatted.map(
      createSaleDetailViewModel
    );
    res.render("sales-history", {
      title: "Figaro - Historico de vendas",
      salesDetail: salesDetail
    });
  } catch (error) {
    next(createError(500, error));
  }
});

router.get("/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    const saleItemsUnformatted:SaleItem[] = query
      ? await saleItemService.getAllByIdAsync(Number.parseInt(query))
      : [];
    const saleItems:SaleItemViewModel[] = saleItemsUnformatted.map(createSaleItemViewModel);

    res.send(saleItems);
  } catch (error) {
    next(createError(500, error));
  }
});

export default router;
