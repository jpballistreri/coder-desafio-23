import express from "express";
import path from "path";
import routerApi from "../routes/api.js";
import web from "../routes/web.js";

import { DBService, DBMensajesSqlite } from "./db";
import * as http from "http";
import { initWSServer } from "./socket";

DBService.init();
//DBMensajesSqlite.init();

/** INICIALIZACION API con EXPRESS */
const app = express();
const publicPath = path.resolve(__dirname, "../../public");
app.use(express.static(publicPath));

app.set("view engine", "pug");
const viewsPath = path.resolve(__dirname, "../../views/");
app.set("views", viewsPath);

const myServer = http.Server(app);
myServer.on("error", (err) => {
  console.log("ERROR ATAJADO", err);
});

initWSServer(myServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*** DEFINICION ROUTERS ***/

app.use("/api", routerApi);
app.use("/productos", web);

export default myServer;
