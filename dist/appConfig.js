"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const errorSetUp_1 = require("./errors/errorSetUp");
const errorConfig_1 = require("./errors/errorConfig");
const email_1 = require("./utils/email");
const twoStepRouter_1 = __importDefault(require("./router/twoStepRouter"));
const appConfig = (app) => {
    app.use((0, cors_1.default)()).use(express_1.default.json()).use((0, helmet_1.default)()).use((0, morgan_1.default)("dev"));
    app.set("view engine", "ejs");
    app.use("/api", twoStepRouter_1.default);
    app.get("/", (req, res) => {
        try {
            return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                message: "API is a success",
            });
            // let optionData = {
            //   email: "cfoonyemmemme@gmail.com",
            //   otp: "2098",
            //   char: "C",
            //   url: `https://mail.google.com`,
            // };
            // return res.status(ERROR_STATS.OK).render("testMail", optionData);
        }
        catch (error) {
            return res.status(errorSetUp_1.ERROR_STATS.NOT_FOUND).json({
                message: "error from the default API Route",
                data: error.message,
            });
        }
    });
    app.get("/test-mail", (req, res) => {
        try {
            (0, email_1.testMail)().then(() => {
                console.log("Sent");
            });
            return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                message: "testing",
            });
        }
        catch (error) {
            return res.status(errorSetUp_1.ERROR_STATS.NOT_FOUND).json({
                message: "can't test",
            });
        }
    });
    app
        .all("*", (req, res, next) => {
        return new errorSetUp_1.errorSetUp({
            name: `Params Error`,
            message: `${req.originalUrl} resulted to this error`,
            status: errorSetUp_1.ERROR_STATS.NOT_FOUND,
            success: false,
        });
    })
        .use(errorConfig_1.errorHandler);
};
exports.appConfig = appConfig;
