"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorSetUp_1 = require("./errorSetUp");
const errorSchema = (err, res) => {
    res.status(errorSetUp_1.ERROR_STATS.NOT_FOUND).json({
        message: err.message,
        name: err.name,
        success: err.success,
        status: err.status,
        stack: err.stack,
        err,
    });
};
const errorHandler = (err, req, res, next) => {
    errorSchema(err, res);
};
exports.errorHandler = errorHandler;
