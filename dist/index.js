"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const envConfig_1 = require("./config/envConfig");
const dbConfig_1 = require("./config/dbConfig");
const appConfig_1 = require("./appConfig");
const port = parseInt(envConfig_1.envConfig.PORT);
const app = (0, express_1.default)();
(0, appConfig_1.appConfig)(app);
const server = app.listen(envConfig_1.envConfig.PORT || port, () => {
    (0, dbConfig_1.dbConfig)();
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
