import express from "express";
import fs from "fs";
import { DBService } from "../services/db";
import { FakerService } from "../services/faker";

const router = express.Router();

router.get("/vista", async (req, res) => {
  const arrayProductos = await DBService.get();
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
