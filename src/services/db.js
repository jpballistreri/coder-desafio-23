import knex from "knex";
import dbConfig from "../../knexfile";
import mongoose from "mongoose";
import * as model from "../models/ecommerce";

class DBProductos {
  constructor() {
    this.URL = "mongodb://172.17.0.3:27017/ecommerce";
  }

  init() {
    console.log("cargando base mongo");
    (async () => {
      try {
        await mongoose.connect(this.URL);

        console.log("MONGODB CONNECTED.");
      } catch (e) {
        console.log("Error: ", e);
      }
    })();
  }

  async get(id) {
    let output = [];
    try {
      if (id) {
        const document = await model.productos.findById(id);
        if (document) output.push(document);
      } else {
        output = await model.productos.find();
      }
      return output;
    } catch (err) {
      return output;
    }
  }

  async create(product) {
    const newProduct = new model.productos(product);
    await newProduct.save();
    console.log("Producto agregado");
    return newProduct;
  }
  async delete(id) {
    await model.productos.findByIdAndDelete(id);
  }
  async update(id, producto) {
    return model.productos.findByIdAndUpdate(id, producto);
  }
}

class DBMensajes {
  constructor() {
    const environment = process.env.NODE_ENV || "development_sqlite3";
    console.log(`SETTING ${environment} DB`);
    const options = dbConfig[environment];
    this.connection = knex(options);
  }

  init() {
    this.connection.schema.hasTable("mensajes").then((exists) => {
      if (exists) return;
      console.log("Creamos la tabla mensajes!");

      return this.connection.schema
        .createTable("mensajes", (mensajesTable) => {
          mensajesTable.increments();
          mensajesTable.string("email").notNullable();
          mensajesTable.string("date").notNullable();
          mensajesTable.string("texto");
        })
        .then(() => {
          console.log("Done");
        });
    });
  }

  async get(tableName) {
    return this.connection(tableName);
  }
  async create(tableName, data) {
    return this.connection(tableName).insert(data);
  }
}

export const DBService = new DBProductos();
export const DBMensajesSqlite = new DBMensajes();
