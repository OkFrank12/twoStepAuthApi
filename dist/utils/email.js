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
exports.sendLastMail = exports.testMail = exports.sendFirstMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const googleapis_1 = require("googleapis");
const envConfig_1 = require("../config/envConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleUrl = envConfig_1.envConfig.G_URL;
const googleId = envConfig_1.envConfig.G_ID;
const googleSecret = envConfig_1.envConfig.G_SECRET;
const googleRefresh = envConfig_1.envConfig.G_REFRESH;
const oAuth = new googleapis_1.google.auth.OAuth2(googleId, googleSecret, googleUrl);
oAuth.setCredentials({ access_token: googleRefresh });
const sendFirstMail = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: googleId,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: auth === null || auth === void 0 ? void 0 : auth._id }, envConfig_1.envConfig.TOKEN);
        const authData = {
            email: auth === null || auth === void 0 ? void 0 : auth.email,
            otp: auth === null || auth === void 0 ? void 0 : auth.otp,
            url: `http://localhost:5173/${token}/first-process`,
        };
        const locateFile = path_1.default.join(__dirname, "../views/firstMail.ejs");
        const readFile = yield ejs_1.default.renderFile(locateFile, authData);
        const mailer = {
            from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
            to: auth === null || auth === void 0 ? void 0 : auth.email,
            subject: "Otp Grant",
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendFirstMail = sendFirstMail;
const testMail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: googleId,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken,
            },
        });
        const authData = {
            email: "cfoonyemmemme@gmail.com",
            url: `http://localhost:2121`,
        };
        const locateFile = path_1.default.join(__dirname, "../views/testMail.ejs");
        const readFile = yield ejs_1.default.renderFile(locateFile, authData);
        const mailer = {
            from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
            to: "cfoonyemmemme@gmail.com",
            subject: "Otp Grant",
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.testMail = testMail;
const sendLastMail = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "cfoonyemmemme@gmail.com",
                clientId: googleId,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: auth === null || auth === void 0 ? void 0 : auth._id }, envConfig_1.envConfig.TOKEN);
        const authData = {
            email: auth === null || auth === void 0 ? void 0 : auth.email,
            url: `http://localhost:5173/${token}/verified`,
        };
        const locateFile = path_1.default.join(__dirname, "../views/lastMail.ejs");
        const readFile = yield ejs_1.default.renderFile(locateFile, authData);
        const mailer = {
            from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
            to: auth === null || auth === void 0 ? void 0 : auth.email,
            subject: `Verification Grant`,
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendLastMail = sendLastMail;
