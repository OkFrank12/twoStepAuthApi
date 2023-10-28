"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = require("./envConfig");
const connectUrl = envConfig_1.envConfig.MONGO_CONNECT;
const dbConfig = () => {
    mongoose_1.default.connect(connectUrl).then(() => {
        console.log(`Database is connected`);
    });
};
exports.dbConfig = dbConfig;
