import express from "express";
import {
  allAuth,
  deleteAuth,
  enterOtpAuth,
  oneAuth,
  registerAuth,
  signInAuth,
  verifyAuth,
} from "../controller/twoStepController";

const router = express.Router();

router.route("/register").post(registerAuth);
router.route("/:token/first-process").post(enterOtpAuth);
router.route("/:token/verified").get(verifyAuth);
router.route("/sign-in").post(signInAuth);
router.route("/:_id/one").get(oneAuth);
router.route("/:_id").delete(deleteAuth);
router.route("/all").get(allAuth);

export default router;
