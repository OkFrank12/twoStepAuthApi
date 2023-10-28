import mongoose from "mongoose";
import { envConfig } from "./envConfig";

const connectUrl: string = envConfig.MONGO_CONNECT;

export const dbConfig = () => {
  mongoose.connect(connectUrl).then(() => {
    console.log(`Database is connected`);
  });
};
