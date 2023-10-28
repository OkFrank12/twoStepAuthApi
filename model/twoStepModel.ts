import mongoose from "mongoose";

interface iTwoStep {
  userName: string;
  email: string;
  password: string;
  otp: string;
  token: string;
  verified: boolean;
}

export interface iTwoStepData extends iTwoStep, mongoose.Document {}

const twoStepModel = new mongoose.Schema<iTwoStepData>(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<iTwoStepData>("two-step-auths", twoStepModel);
