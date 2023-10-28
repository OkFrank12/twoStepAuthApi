"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSetUp = exports.ERROR_STATS = void 0;
var ERROR_STATS;
(function (ERROR_STATS) {
    ERROR_STATS[ERROR_STATS["OK"] = 200] = "OK";
    ERROR_STATS[ERROR_STATS["CREATED"] = 201] = "CREATED";
    ERROR_STATS[ERROR_STATS["DELETE"] = 202] = "DELETE";
    ERROR_STATS[ERROR_STATS["UPDATED"] = 200] = "UPDATED";
    ERROR_STATS[ERROR_STATS["NOT_VERIFIED"] = 403] = "NOT_VERIFIED";
    ERROR_STATS[ERROR_STATS["UN_AUTHOURISED"] = 401] = "UN_AUTHOURISED";
    ERROR_STATS[ERROR_STATS["NOT_FOUND"] = 404] = "NOT_FOUND";
    ERROR_STATS[ERROR_STATS["UN_FULFILLED"] = 500] = "UN_FULFILLED";
})(ERROR_STATS || (exports.ERROR_STATS = ERROR_STATS = {}));
class errorSetUp extends Error {
    constructor(args) {
        super(args.message);
        this.success = false;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name;
        this.message = args.message;
        this.status = args.status;
        if (args.success !== undefined) {
            this.success = args.success;
        }
        Error.captureStackTrace(this);
    }
}
exports.errorSetUp = errorSetUp;
