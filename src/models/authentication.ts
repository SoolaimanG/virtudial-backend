import { Schema, model } from "mongoose";
import {
  IForgetPassword,
  IJoinWaitList,
  IUser,
  IVerifyAccount,
} from "../types";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true }, // Added unique constraint
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 16,
      unique: true,
    },
    isAccountVerified: { type: Boolean, default: false },
    countryCode: { type: String, require: false, default: "NG" },
    verificationMeans: {
      type: String,
      enum: ["email", "phoneNumber"],
      default: "email",
    },
    authentication: {
      password: { type: String, required: false, select: false }, // Exclude password by default from queries
      salt: { type: String, required: false, select: false },
      sessionToken: {
        type: String,
        required: false,
        default: null,
        select: false,
      },
      authType: { type: String, default: "local", enum: ["local", "google"] },
    },
  },
  {
    timestamps: true,
  }
);

const VerifyAccountSchema = new Schema<IVerifyAccount>({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  expires_at: { type: "Number", required: true },
});

const ForgetPasswordSchema = new Schema<IForgetPassword>({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  expires_at: { type: Number, required: true },
  requestCount: { type: Number, required: true },
  lastRequested: { type: Number, required: true },
});

const JoinWaitListSchema = new Schema<IJoinWaitList>(
  {
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
export const VerifyAccountModel = model("verifyAccount", VerifyAccountSchema);
export const JoinWaitListModel = model("joinWaitList", JoinWaitListSchema);
export const ForgetPasswordModel = model(
  "forgetPassword",
  ForgetPasswordSchema
);
