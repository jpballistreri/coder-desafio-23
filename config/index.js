import dotenv from "dotenv";
dotenv.config();

const venvs = {
  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || "dbname",
  MONGO_LOCAL_IP: process.env.MONGO_LOCAL_IP || "localhost",
  MONGO_LOCAL_PORT: process.env.MONGO_LOCAL_PORT || "27017",
  PORT: process.env.PORT || 8080,
};

export default venvs;
