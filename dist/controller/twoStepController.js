"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuth = exports.oneAuth = exports.allAuth = exports.signInAuth = exports.verifyAuth = exports.enterOtpAuth = exports.registerAuth = void 0;
const twoStepModel_1 = __importDefault(require("../model/twoStepModel"));
const errorSetUp_1 = require("../errors/errorSetUp");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const envConfig_1 = require("../config/envConfig");
const registerAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, userName } = req.body;
        const salted = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salted);
        const generateCode = crypto_1.default.randomBytes(10).toString("hex");
        const generateOTP = crypto_1.default.randomBytes(2).toString("hex");
        const auth = yield twoStepModel_1.default.create({
            userName,
            email,
            password: hashed,
            otp: generateOTP,
            token: generateCode,
        });
        (0, email_1.sendFirstMail)(auth).then(() => {
            console.log(`First Mail is sent...`);
        });
        return res.status(errorSetUp_1.ERROR_STATS.CREATED).json({
            message: "Register Auth created",
            data: auth,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: "error via register auth",
            data: error.message,
        });
    }
});
exports.registerAuth = registerAuth;
const enterOtpAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, envConfig_1.envConfig.TOKEN, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const auth = yield twoStepModel_1.default.findById(payload.id);
                if ((auth === null || auth === void 0 ? void 0 : auth.otp) === otp) {
                    (0, email_1.sendLastMail)(auth).then(() => {
                        console.log(`Last Mail is sent...!`);
                    });
                    return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                        message: `Please go and verify`,
                    });
                }
                else {
                    return res.status(errorSetUp_1.ERROR_STATS.UN_AUTHOURISED).json({
                        message: "Check your OTP",
                    });
                }
            }
        }));
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: "error entering otp",
            data: error.message,
        });
    }
});
exports.enterOtpAuth = enterOtpAuth;
const verifyAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, envConfig_1.envConfig.TOKEN, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const auth = yield twoStepModel_1.default.findById(payload.id);
                if (auth) {
                    yield twoStepModel_1.default.findByIdAndUpdate(auth === null || auth === void 0 ? void 0 : auth._id, {
                        token: "",
                        verified: true,
                    }, { new: true });
                    return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                        message: "Congratulations...!!! You have been verified",
                    });
                }
                else {
                    return res.status(errorSetUp_1.ERROR_STATS.UN_AUTHOURISED).json({
                        message: `Token might not be correct`,
                    });
                }
            }
        }));
        return res;
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: `Error verifying auth`,
            data: error.message,
        });
    }
});
exports.verifyAuth = verifyAuth;
const signInAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const auth = yield twoStepModel_1.default.findOne({ email });
        if (auth) {
            const checkPassword = yield bcrypt_1.default.compare(password, auth.password);
            if (checkPassword) {
                if (auth.verified && auth.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: auth === null || auth === void 0 ? void 0 : auth._id }, envConfig_1.envConfig.TOKEN);
                    return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                        message: `Welcome ${auth.email}`,
                        data: token,
                    });
                }
                else {
                    return res.status(errorSetUp_1.ERROR_STATS.NOT_VERIFIED).json({
                        message: `User is not verified`,
                    });
                }
            }
            else {
                return res.status(errorSetUp_1.ERROR_STATS.UN_AUTHOURISED).json({
                    message: `Invalid Password provided`,
                });
            }
        }
        else {
            return res.status(errorSetUp_1.ERROR_STATS.NOT_FOUND).json({
                message: `Auth not found`,
            });
        }
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: "error signing in auth",
            data: error.message,
        });
    }
});
exports.signInAuth = signInAuth;
const allAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield twoStepModel_1.default.find();
        if (all.length === 0) {
            return res.status(errorSetUp_1.ERROR_STATS.NOT_FOUND).json({
                message: `There are no auth found`,
            });
        }
        else {
            return res.status(errorSetUp_1.ERROR_STATS.OK).json({
                message: `All Auths Found`,
                data: all,
            });
        }
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: "error reading all auth",
            data: error.message,
        });
    }
});
exports.allAuth = allAuth;
const oneAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const one = yield twoStepModel_1.default.findById(_id);
        return res.status(errorSetUp_1.ERROR_STATS.OK).json({
            message: `One Auth found`,
            data: one,
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: "error reading one auth",
            data: error.message,
        });
    }
});
exports.oneAuth = oneAuth;
const deleteAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        yield twoStepModel_1.default.findByIdAndDelete(_id);
        return res.status(errorSetUp_1.ERROR_STATS.DELETE).send({
            message: "Deleted",
        });
    }
    catch (error) {
        return res.status(errorSetUp_1.ERROR_STATS.UN_FULFILLED).json({
            message: `error deleting auth`,
            data: error.message,
        });
    }
});
exports.deleteAuth = deleteAuth;
