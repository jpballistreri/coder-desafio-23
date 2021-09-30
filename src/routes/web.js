import express from "express";
import fs from "fs";
import { DBProductos } from "../services/db";
import { FakerService } from "../services/faker";

const router = express.Router();

router.get("/login", (req, res) => {
  const { username } = req.query;
  // const body = req.body;

  if (username) {
    req.session.loggedIn = true;
    req.session.contador = 1;
    req.session.admin = true;
    res.json({
      msg: `bienvenido ${username}, contador=${req.session.contador}`,
    });
  } else res.status(401).json({ msg: "no estas autorizado" });
});

const validateLogIn = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.status(401).json({ msg: "no estas autorizado" });
};

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ msg: "session destruida" });
});

router.get("/secret-endpoint", validateLogIn, (req, res) => {
  req.session.contador++;
  res.json({
    msg: "informacion super secreta",
    contador: req.session.contador,
  });
});

router.get("/vista", async (req, res) => {
  const arrayProductos = await DBProductos.get();
  console.log(arrayProductos);

  res.render("main", arrayProductos);
});

router.get("/ingreso", (req, res) => {
  res.render("ingreso");
});

router.get("/vista-test", (req, res) => {
  const cantidad = req.query.cant ? Number(req.query.cant) : 10;
  const arrayProductos = FakerService.generar(cantidad);
  console.log(arrayProductos);

  res.render("vista-test", { arrayProductos: arrayProductos });
});

export default router;
