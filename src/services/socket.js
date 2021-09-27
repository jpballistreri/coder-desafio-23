import exp from "constants";
import socketIo from "socket.io";
import { DBService, DBMensajesSqlite } from "../services/db";
import moment from "moment";
//import myServer from "./server";

export const initWSServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("\n\nUn cliente se ha conectado");
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

    socket.on("nuevo-producto", async () => {
      console.log("Nuevo Producto!");
      const productos = await DBService.get();
      io.emit("array-productos", productos);
    });

    socket.on("nuevo-mensaje", async (email, texto) => {
      function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }

      if (validateEmail(email) == false) {
        socket.emit("mensaje-error", {
          msj: "Por favor, ingrese un Email válido.",
        });
      } else {
        ////Guarda mensaje
        const nuevoMensaje = {
          email: email,
          date: `${moment().subtract(10, "days").calendar()} ${moment().format(
            "LTS"
          )}`,
          texto: texto,
        };
        await DBMensajesSqlite.create("mensajes", nuevoMensaje);
        const arrayMensajes = await DBMensajesSqlite.get("mensajes");
        io.emit("array-mensajes", arrayMensajes);
      }
    });

    socket.on("get-productos", async () => {
      const productos = await DBService.get();
      socket.emit("array-productos", productos);
    });

    socket.on("get-mensajes", async () => {
      const mensajes = await DBMensajesSqlite.get("mensajes");
      socket.emit("array-mensajes", mensajes);
    });
  });
  return io;
};
