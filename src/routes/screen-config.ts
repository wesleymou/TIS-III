import { Router } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";

import { checkAuthToken } from "../middlewares/session-check";

import UserService from "../services/UserService";

import User from "../models/User";

const router = Router();
const userService = new UserService();

router.use(checkAuthToken);

router.get("/", (req, res, next) => {
  try {
    res.render("screen-config", {
      tittle: "Figaro - Configurações"
    });
  } catch (error) {}
});

router.post("/change-password", async (req, res, next) => {
  try {
    const { oldPassword } = req.body;
    const { newPassword } = req.body;

    if(!oldPassword && !newPassword){
      res.status(400).send("Por favor, complete os dois campos");
    }

    let user: User = await userService.getByUserName("admin");

    if (await bcrypt.compare(oldPassword, user.password)) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      user.password = hash;
      userService.updateAsync(user);

      res.status(200).send("Senha alterada com sucesso.");
    } else {
      res.status(400).send("A senha antiga está incorreta");
    }
  } catch (error) {
    res.status(400).send("A senha antiga está incorreta");
  }
});

export default router;
