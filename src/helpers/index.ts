import dotenv from "dotenv";
import { authType, availableNumberTypes, customStatus, IUser } from "types";
import { JoinWaitListModel, UserModel } from "../models/authentication";
import mongoose from "mongoose";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import twilioClient from "twilio";
import { usaCallingCode } from "../data/usaCallingCode";

dotenv.config();

export const openConnectionPool = async () => {
  console.log(process.env.DATABASE_URL);
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      maxPoolSize: 10,
      tls: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Rethrow the error to handle it further up the call stack if needed
  }
};

export const httpStatusResponse = (
  code: number,
  message?: string,
  data?: {},
  _status?: customStatus
) => {
  const status: Record<number, any> = {
    200: {
      status: _status?.status || "success",
      message: message || "Request successful",
      data,
    },
    400: {
      status: _status?.status || "bad request",
      message: message || "An error has occurred on the client side.",
      data,
    },
    401: {
      status: _status?.status || "unauthorized access",
      message:
        message ||
        "You are not authorized to make this request or access this endpoint",
      data,
    },
    404: {
      status: _status?.status || "not found",
      message:
        message ||
        "The resources you are looking for cannot be found or does not exist",
      data,
    },
    409: {
      status: _status?.status || "conflict",
      message:
        message ||
        "The resources you are requesting for is having a conflict with something, please message us if this issue persist",
      data,
    },
    429: {
      status: _status?.status || "too-many-request",
      message:
        message || "Please wait again later, you are sending too many request.",
      data,
    },
    500: {
      status: _status?.status || "server",
      message:
        message ||
        "Sorry, The problem is from our end please try again later or message us if this issue persist, sorry for the inconvenience",
      data,
    },
  };

  return status[code];
};

export const closeConnection = async () => {
  await mongoose.disconnect();
  console.log("Connection Closed");
};

export const isPasswordStrong = (password: string): boolean => {
  // Define the regular expression for a strong password
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Test the password against the regex
  return strongPasswordRegex.test(password);
};

export const isStringAnEmail = (email: string): boolean => {
  // Define the regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regex
  return emailRegex.test(email);
};

export const findUserByEmail = async (
  email: string,
  options?: {
    includePassword?: boolean;
  }
) => {
  const userInstance = UserModel.findOne({ email });

  if (options?.includePassword) {
    userInstance.select("+authentication.password +authentication.salt");
  }

  const user = await userInstance.exec();

  return user;
};

export const findUserByPhoneNumber = async (
  phoneNumber: string,
  options?: { includePassword?: boolean }
) => {
  const userInstance = UserModel.findOne({ phoneNumber });
  if (options?.includePassword) {
    userInstance.select("+authentication.password +authentication.salt");
  }

  const user = await userInstance.exec();

  return user;
};

export const findUserById = async (
  id: string,
  options?: { includePassword?: boolean }
) => {
  const userInstance = UserModel.findById(id);

  if (options?.includePassword) {
    userInstance.select("+authentication.password +authentication.salt");
  }

  const user = await userInstance.exec();

  return user;

  return user;
};

export const findUserByIdAndUpdate = async (
  userID: string,
  data: Record<string, any>
) => {
  const _user = await UserModel.findByIdAndUpdate(userID, data);

  return _user;
};

export const sendEmail = async (
  recipients: string,
  emailTemplate: string,
  replyTo?: string,
  subject?: string
) => {
  let configOptions: SMTPTransport | SMTPTransport.Options | string = {
    host: "smtp-relay.brevo.com",
    port: 587,
    ignoreTLS: true,
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_EMAIL_PASSWORD,
    },
  };

  const transporter = createTransport(configOptions);
  await transporter.sendMail({
    from: "noreply@gmail.com",
    to: recipients,
    html: emailTemplate,
    replyTo,
    subject: subject,
  });
};

export const sendMessageToPhoneNumber = async (body: string, to: string) => {
  const _twilioClient = twilioClient(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_AUTH_TOKEN
  );
  await _twilioClient.messages.create({
    body,
    to,
    from: "+13343360538",
  });
};

export const generateOTP = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
};

export const joinNewsLetter = async (email: string) => {
  await JoinWaitListModel.create({
    email,
  });
};

export const allowSpecifiedAuthentication = async (
  userId: string,
  allowAuth: authType = "local"
) => {
  try {
    const user = await findUserById(userId);

    if (user.authentication.authType !== allowAuth)
      throw new Error("Something went wrong: Invalid Authentication type");
  } catch (error) {
    throw new Error(error);
  }
};

export const returnUser = (
  user: IUser,
  option?: { includeAuthentication: boolean }
) => {
  const { authType, sessionToken, password, salt } = user.authentication;

  const _user: IUser = {
    email: user.email,
    phoneNumber: user.phoneNumber,
    countryCode: user.countryCode,
    id: user.id,
    isAccountActive: user.isAccountActive,
    isAccountVerified: user.isAccountVerified,
    verificationMeans: user.verificationMeans,
    authentication: option?.includeAuthentication
      ? { authType, sessionToken, password, salt }
      : null,
  };

  return _user;
};

export const generateRandomNumbers = (len: number, castToString = false) => {
  let randomNumbers;

  for (let index = 0; index < len; index++) {
    const rn = Math.floor(Math.random() * 9);

    if (castToString) {
      randomNumbers = +String(rn);
    }

    randomNumbers = +rn;
  }

  return randomNumbers;
};

export const createNumber = (
  numberType: availableNumberTypes = "normal",
  country: string
) => {
  let phoneNumber;

  if (numberType === "usa-special-numbers") {
    return;
  }

  if (numberType === "normal") {
    const country = "";
    return;
  }

  // First Know the country we are creating it's number then know the len the number is suppose to be then, the callingCode, the state if applicable

  const number = generateRandomNumbers(7, true);
};
