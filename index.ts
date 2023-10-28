import express, { Application } from "express";
import { envConfig } from "./config/envConfig";
import { dbConfig } from "./config/dbConfig";
import { appConfig } from "./appConfig";

const port: number = parseInt(envConfig.PORT);
const app: Application = express();
appConfig(app);

const server = app.listen(envConfig.PORT || port, () => {
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
