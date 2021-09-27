import Mongoose from "mongoose";
import mongoose from "mongoose";

const mensajesCollection = "mensajes";
const productosCollection = "productos";

const mensajesSchema = new Mongoose.Schema({
  _id: { type: String },
  email: { type: String, required: true },
  date: { type: String, required: true },
  texto: { type: String, required: false },
});

const productosSchema = new Mongoose.Schema({
  title: { type: String, required: false },
  price: { type: String, required: false },
  thumbnail: { type: String, required: false },
  stock: { type: Number, required: false },
});

export const mensajes = new Mongoose.model(mensajesCollection, mensajesSchema);
export const productos = new Mongoose.model(
  productosCollection,
  productosSchema
);
