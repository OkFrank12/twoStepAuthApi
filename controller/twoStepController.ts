import { Request, Response } from "express";
import twoStepModel from "../model/twoStepModel";
import { ERROR_STATS } from "../errors/errorSetUp";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendFirstMail, sendLastMail } from "../utils/email";
import { envConfig } from "../config/envConfig";

export const registerAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, userName } = req.body;
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);
    const generateCode = crypto.randomBytes(10).toString("hex");
    const generateOTP = crypto.randomBytes(2).toString("hex");

    const auth = await twoStepModel.create({
      userName,
      email,
      password: hashed,
      otp: generateOTP,
      token: generateCode,
    });

    sendFirstMail(auth).then(() => {
      console.log(`First Mail is sent...`);
    });

    return res.status(ERROR_STATS.CREATED).json({
      message: "Register Auth created",
      data: auth,
    });
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: "error via register auth",
      data: error.message,
    });
  }
};

export const enterOtpAuth = async (
  req: Request,
  res: Response
) => {
  try {
    const { otp } = req.body;
    const { token } = req.params;
    jwt.verify(token, envConfig.TOKEN, async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const auth = await twoStepModel.findById(payload.id);

        if (auth?.otp === otp) {
          sendLastMail(auth).then(() => {
            console.log(`Last Mail is sent...!`);
          });

          return res.status(ERROR_STATS.OK).json({
            message: `Please go and verify`,
          });
        } else {
          return res.status(ERROR_STATS.UN_AUTHOURISED).json({
            message: "Check your OTP",
          });
        }
      }
    });
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: "error entering otp",
      data: error.message,
    });
  }
};

export const verifyAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    jwt.verify(token, envConfig.TOKEN, async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const auth = await twoStepModel.findById(payload.id);

        if (auth) {
          await twoStepModel.findByIdAndUpdate(
            auth?._id,
            {
              token: "",
              verified: true,
            },
            { new: true }
          );

          return res.status(ERROR_STATS.OK).json({
            message: "Congratulations...!!! You have been verified",
          });
        } else {
          return res.status(ERROR_STATS.UN_AUTHOURISED).json({
            message: `Token might not be correct`,
          });
        }
      }
    });

    return res;
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: `Error verifying auth`,
      data: error.message,
    });
  }
};

export const signInAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const auth = await twoStepModel.findOne({ email });

    if (auth) {
      const checkPassword = await bcrypt.compare(password, auth.password);
      if (checkPassword) {
        if (auth.verified && auth.token === "") {
          const token = jwt.sign({ id: auth?._id }, envConfig.TOKEN);
          return res.status(ERROR_STATS.OK).json({
            message: `Welcome ${auth.email}`,
            data: token,
          });
        } else {
          return res.status(ERROR_STATS.NOT_VERIFIED).json({
            message: `User is not verified`,
          });
        }
      } else {
        return res.status(ERROR_STATS.UN_AUTHOURISED).json({
          message: `Invalid Password provided`,
        });
      }
    } else {
      return res.status(ERROR_STATS.NOT_FOUND).json({
        message: `Auth not found`,
      });
    }
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: "error signing in auth",
      data: error.message,
    });
  }
};

export const allAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await twoStepModel.find();

    if (all.length === 0) {
      return res.status(ERROR_STATS.NOT_FOUND).json({
        message: `There are no auth found`,
      });
    } else {
      return res.status(ERROR_STATS.OK).json({
        message: `All Auths Found`,
        data: all,
      });
    }
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: "error reading all auth",
      data: error.message,
    });
  }
};

export const oneAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;

    const one = await twoStepModel.findById(_id);

    return res.status(ERROR_STATS.OK).json({
      message: `One Auth found`,
      data: one,
    });
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: "error reading one auth",
      data: error.message,
    });
  }
};

export const deleteAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    await twoStepModel.findByIdAndDelete(_id);

    return res.status(ERROR_STATS.DELETE).send({
      message: "Deleted",
    });
  } catch (error: any) {
    return res.status(ERROR_STATS.UN_FULFILLED).json({
      message: `error deleting auth`,
      data: error.message,
    });
  }
};
