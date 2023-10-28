import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { ERROR_STATS, errorSetUp } from "./errors/errorSetUp";
import { errorHandler } from "./errors/errorConfig";
import { sendFirstMail, sendLastMail, testMail } from "./utils/email";
import router from "./router/twoStepRouter";

export const appConfig = (app: Application) => {
  app.use(cors()).use(express.json()).use(helmet()).use(morgan("dev"));
  app.set("view engine", "ejs");

  app.use("/api", router);

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(ERROR_STATS.OK).json({
        message: "API is a success",
      });

      // let optionData = {
      //   email: "cfoonyemmemme@gmail.com",
      //   otp: "2098",
      //   char: "C",
      //   url: `https://mail.google.com`,
      // };

      // return res.status(ERROR_STATS.OK).render("testMail", optionData);
    } catch (error: any) {
      return res.status(ERROR_STATS.NOT_FOUND).json({
        message: "error from the default API Route",
        data: error.message,
      });
    }
  });

  app.get("/test-mail", (req: Request, res: Response) => {
    try {
      testMail().then(() => {
        console.log("Sent");
      });

      return res.status(ERROR_STATS.OK).json({
        message: "testing",
      });
    } catch (error: any) {
      return res.status(ERROR_STATS.NOT_FOUND).json({
        message: "can't test",
      });
    }
  });

  app
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      return new errorSetUp({
        name: `Params Error`,
        message: `${req.originalUrl} resulted to this error`,
        status: ERROR_STATS.NOT_FOUND,
        success: false,
      });
    })
    .use(errorHandler);
};
