import { Router } from "express";
import createError from "http-errors";

import { checkAuthToken } from "../middlewares/session-check";

const router = Router();

router.use(checkAuthToken);

router.get("/", (req, res, next) => {
  try {
    res.render("screen-config", {
      tittle: "Figaro - Configurações"
    });
  } catch (error) {}
});

export default router;