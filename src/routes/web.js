import express from "express";
import fs from "fs";
import { DBProductos } from "../services/db";
import { FakerService } from "../services/faker";
import path from "path";

const router = express.Router();
const publicPath = path.resolve(__dirname, "../../public");

router.get("/", (req, res) => {
  console.log("/");
  if (req.session.loggedIn == true) {
    res.redirect("/productos/vista");
  } else {
    res.redirect("/productos/login");
  }
});

router.get("/login", async (req, res) => {
  if (req.session.username) {
    res.redirect("/productos/vista");
  } else {
    res.sendFile(publicPath + "/login.html");
  }
});

router.post("/login", async (req, res) => {
  let { username } = req.body;

  if (username) {
    req.session.loggedIn = true;
    req.session.admin = true;
    req.session.username = username;
    console.log(username);
    res.redirect("/productos/");
  } else {
    res.redirect("/productos/login");
  }
});

const validateLogIn = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.redirect("/productos/login");
};

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ msg: "session cerrada" });
});

router.get("/secret-endpoint", validateLogIn, async (req, res) => {
  req.session.contador++;
  res.json({
    msg: "informacion super secreta",
    contador: req.session.contador,
  });
});

router.get("/vista", validateLogIn, async (req, res) => {
  req.session.contador++;
  const username = req.session.username;
  res.render("main", { username });
});

router.get("/ingreso", validateLogIn, async (req, res) => {
  req.session.contador++;
  const username = req.session.username;
  res.render("ingreso", { username });
});

router.get("/vista-test", (req, res) => {
  const cantidad = req.query.cant ? Number(req.query.cant) : 10;
  const arrayProductos = FakerService.generar(cantidad);
  console.log(arrayProductos);

  res.render("vista-test", { arrayProductos: arrayProductos });
});

export default router;
