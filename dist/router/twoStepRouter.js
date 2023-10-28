"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twoStepController_1 = require("../controller/twoStepController");
const router = express_1.default.Router();
router.route("/register").post(twoStepController_1.registerAuth);
router.route("/:token/first-process").post(twoStepController_1.enterOtpAuth);
router.route("/:token/verified").get(twoStepController_1.verifyAuth);
router.route("/sign-in").post(twoStepController_1.signInAuth);
router.route("/:_id/one").get(twoStepController_1.oneAuth);
router.route("/:_id").delete(twoStepController_1.deleteAuth);
router.route("/all").get(twoStepController_1.allAuth);
exports.default = router;
