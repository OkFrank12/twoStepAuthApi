import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import { google } from "googleapis";
import { envConfig } from "../config/envConfig";
import jwt from "jsonwebtoken";

const googleUrl: string = envConfig.G_URL;
const googleId: string = envConfig.G_ID;
const googleSecret: string = envConfig.G_SECRET;
const googleRefresh = envConfig.G_REFRESH;

const oAuth = new google.auth.OAuth2(googleId, googleSecret, googleUrl);
oAuth.setCredentials({ access_token: googleRefresh });

export const sendFirstMail = async (auth: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
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

    const token = jwt.sign({ id: auth?._id }, envConfig.TOKEN);

    const authData = {
      email: auth?.email,
      otp: auth?.otp,
      url: `http://localhost:5173/${token}/first-process`,
    };

    const locateFile = path.join(__dirname, "../views/firstMail.ejs");
    const readFile = await ejs.renderFile(locateFile, authData);

    const mailer = {
      from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
      to: auth?.email,
      subject: "Otp Grant",
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error) {
    console.log(error);
  }
};

export const testMail = async () => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
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

    const locateFile = path.join(__dirname, "../views/testMail.ejs");
    const readFile = await ejs.renderFile(locateFile, authData);

    const mailer = {
      from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
      to: "cfoonyemmemme@gmail.com",
      subject: "Otp Grant",
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error) {
    console.log(error);
  }
};

export const sendLastMail = async (auth: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
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

    const token = jwt.sign({ id: auth?._id }, envConfig.TOKEN);

    const authData = {
      email: auth?.email,
      url: `http://localhost:5173/${token}/verified`,
    };

    const locateFile = path.join(__dirname, "../views/lastMail.ejs");
    const readFile = await ejs.renderFile(locateFile, authData);

    const mailer = {
      from: "Two-Step-Test <cfoonyemmemme@gmail.com>",
      to: auth?.email,
      subject: `Verification Grant`,
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
