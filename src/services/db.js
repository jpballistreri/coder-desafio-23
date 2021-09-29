import knex from "knex";
import dbConfig from "../../knexfile";
import mongoose from "mongoose";
import * as model from "../models/ecommerce";
import Config from "../../config";
import { normalize, schema } from "normalizr";

export const connectToDB = async () => {
  try {
    console.log("CONECTANDO A MI DB");
    await mongoose.connect(
      `mongodb://${Config.MONGO_LOCAL_IP}:${Config.MONGO_LOCAL_PORT}/${Config.MONGO_LOCAL_DBNAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("YA ESTOY CONECTADO");
    return "Connection Established";
  } catch (error) {
    console.log(`ERROR => ${error}`);
    return error;
  }
};

class Productos {
  constructor() {}

  async get(id) {
    console.log("entrando al get de productos");
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

class Mensajes {
  constructor() {
    this.URL = `mongodb://${Config.MONGO_LOCAL_IP}:${Config.MONGO_LOCAL_PORT}/${Config.MONGO_LOCAL_DBNAME}`;
  }

  async get() {
    const author = new schema.Entity("author", {}, { idAttribute: "email" });

    const msge = new schema.Entity(
      "message",
      {
        author: author,
      },
      { idAttribute: "_id" }
    );

    const msgesSchema = new schema.Array(msge);
    console.log("adentro del get");
    //const output = await model.mensajes.find();
    let messages = (await model.mensajes.find()).map((aMsg) => ({
      _id: aMsg._id,
      author: aMsg.author,
      text: aMsg.text,
    }));
    //console.log(output);
    let normalizedMessages = normalize(messages, msgesSchema);
    return normalizedMessages;
  }

  async create(mensaje) {
    console.log(mensaje);
    let messageToSave = new model.mensajes(mensaje);
    let savedMessage = await messageToSave.save();
    return savedMessage;
  }
}

//class DBMensajes {
//  constructor() {
//    const environment = process.env.NODE_ENV || "development_sqlite3";
//    console.log(`SETTING ${environment} DB`);
//    const options = dbConfig[environment];
//    this.connection = knex(options);
//  }
//
//  init() {
//    this.connection.schema.hasTable("mensajes").then((exists) => {
//      if (exists) return;
//      console.log("Creamos la tabla mensajes!");
//
//      return this.connection.schema
//        .createTable("mensajes", (mensajesTable) => {
//          mensajesTable.increments();
//          mensajesTable.string("email").notNullable();
//          mensajesTable.string("date").notNullable();
//          mensajesTable.string("texto");
//        })
//        .then(() => {
//          console.log("Done");
//        });
//    });
//  }

//  async get(tableName) {
//    return this.connection(tableName);
//  }
//  async create(tableName, data) {
//    return this.connection(tableName).insert(data);
//  }
//}

export const DBProductos = new Productos();
export const DBMensajes = new Mensajes();
