"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const twoStepModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: [true, "Your UserName is required"],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: true,
        min: [7, "Your Password must exceed 7"],
    },
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("two-step-auths", twoStepModel);
