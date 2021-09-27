import express from "express";
import fs from "fs";
import { DBService } from "../services/db";
import { FakerService } from "../services/faker";

const router = express.Router();

router.get("/productos/", async (req, res) => {
  const items = await DBService.get();
  res.json({
    data: items,
  });
});

router.get("/productos/:id", async (req, res) => {
  const { id } = req.params;

  const result = await DBService.get(id);
  if (!result.length)
    return res.status(404).json({
      msgs: "Producto no encontrado!",
    });

  res.json({
    data: result,
  });
});

router.post("/productos/", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  //Validar datos ingresados
  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }
  const item = {
    title,
    price,
    thumbnail,
  };

  const newProduct = await DBService.create(item);
  //const newProduct = await DBService.get("productos", newId);
  res.json({
    msj: "Producto agregado.",
    data: newProduct,
  });
});

router.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const productoAEliminar = await DBService.get(id);
  if (!productoAEliminar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  await DBService.delete(id);

  res.json({
    Producto_eliminado: productoAEliminar,
  });
});

router.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, thumbnail } = req.body;
  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }

  const productoAActualizar = await DBService.get(id);
  if (!productoAActualizar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  const item = {
    title,
    price,
    thumbnail,
  };

  await DBService.update(id, item);
  const productoActualizado = await DBService.get(id);
  //console.log(await productoActualizado);
  res.json({
    Producto_actualizado: productoActualizado,
  });
});

export default router;
