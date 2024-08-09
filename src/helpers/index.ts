import { IPhoneNumbers, phoneNumberFeatures, stateProps } from "./../types";
import { europeCountries } from "./../data/europeCountriesCallingCodes";
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

export const generateRandomNumbers = (
  len: number,
  castToString: boolean = false,
  withinSize: boolean = false
): string | number => {
  let randomNumbers: string | number;

  if (withinSize) {
    randomNumbers = Math.floor(Math.random() * len);
  } else {
    randomNumbers = castToString ? "" : 0;
    for (let index = 0; index < len; index++) {
      const rn = Math.floor(Math.random() * 10); // Random number between 0 and 9

      if (castToString) {
        randomNumbers += String(rn);
      } else {
        randomNumbers = Number(randomNumbers) + rn;
      }
    }
  }

  return randomNumbers;
};

export async function isStateInCountry(
  _country: string,
  _state: string,
  type: availableNumberTypes = "normal"
) {
  // 1

  const country =
    type === "usa-special-numbers"
      ? usaCallingCode.country
      : europeCountries.find(
          (c) => c.country.name.toLowerCase() === _country.toLowerCase()
        ).country;

  if (!country)
    throw new Error(
      "The country you selected is not found. please try using a different country."
    );

  // console.log({ country, _country });

  const state = country.states?.[_state];

  // console.log({ _state });
  //
  if (!state)
    throw new Error(
      "The state you selected is not available within the selected country"
    );

  return { country, state: { ...state, name: _state } };
}

export const createTagsForNumber = (
  country: string,
  price: string,
  phoneNumber: string,
  areaCode: string = "",
  region: "europe",
  features: phoneNumberFeatures[],
  state: string = ""
) => {
  // Tags should consist of country, state, price, phoneNumber, areaCode, region, features
  return [
    country.toLowerCase(),
    price,
    phoneNumber,
    areaCode,
    region,
    state,
    ...features,
  ].filter(Boolean);
};

export const assignFeatureToNumber = () => {
  //
  const sms: phoneNumberFeatures = "sms";
  const features: phoneNumberFeatures[] = ["voice-call", "voice-mail"];
  let selectedFeatures: phoneNumberFeatures[] = [];

  const rounds = Math.floor(Math.random() * features.length);
  //

  while (selectedFeatures.length < rounds) {
    const randomFeature =
      features[generateRandomNumbers(features.length, false, true) as number];
    if (!selectedFeatures.includes(randomFeature)) {
      selectedFeatures.push(randomFeature);
    }
  }

  return [...selectedFeatures, sms];
};

export const discount = (applyCoupon: boolean = false) => {
  return applyCoupon ? 20 / 100 : 1;
};

export const assignDescToPhoneNumber = (
  features: phoneNumberFeatures[],
  expirationTime: number,
  popularity: number,
  region: string
): string => {
  const featuresDescription = features.join(", ").toUpperCase();

  const expirationDescription = `This number is active for ${expirationTime} month${
    expirationTime > 1 ? "s" : ""
  }.`;
  const popularityDescription = `So far, ${popularity} people have bought this phone number.`;
  const regionDescription = `The region for this number is ${region}.`;

  return `This phone number has the following features: ${featuresDescription}. ${expirationDescription} ${popularityDescription} ${regionDescription}`;
};

//

export const createNumber = async (
  type: availableNumberTypes = "normal",
  country: string,
  state?: string,
  isCustom: boolean = false,
  _phoneNumber?: string,
  _stock: number = 20,
  _expirationMonth: number = 2
) => {
  let statesOfCountry: string[] = [];
  let statesProps: Record<string, stateProps> = {};

  const expirationDate = Date.now() + 60 * 60 * 24 * 7 * 4 * _expirationMonth;

  const data: IPhoneNumbers = {
    activationStatus: false,
    areaCode: "",
    countryCode: "",
    description: "",
    expirationDate: expirationDate,
    features: assignFeatureToNumber(),
    number: "",
    popularity: isCustom ? 1 : 0,
    price: 0,
    region: "europe",
    state: "",
    stock: isCustom ? 1 : _stock,
    tags: [],
    country,
    type,
  };

  if (type === "usa-special-numbers") {
    const country = usaCallingCode.country;
    statesOfCountry = Object.keys(country.states);
    statesProps = country.states;
  } else if (type === "normal") {
    const idx = europeCountries.map((_) => _.country.name).indexOf(country);
    const _country = europeCountries[idx].country;

    statesOfCountry = Object.keys(_country.states);
    statesProps = _country.states;
  }
  //
  const lengthOfStates = generateRandomNumbers(
    statesOfCountry.length,
    false,
    true
  ) as number;
  const randomState = statesOfCountry[lengthOfStates];

  const actualState = statesProps[state || randomState];

  const _number = generateRandomNumbers(
    actualState.phoneNumberLength - (actualState.callingCode.length - 1),
    true
  );
  const phoneNumber = `${actualState.callingCode}${_phoneNumber || _number}`;

  // Check if state is available make sure that the state is available within the country chosen
  const { country: _country, state: _state } = await isStateInCountry(
    country,
    state || randomState,
    type
  );
  //
  const _price = isCustom
    ? 5.0 * _expirationMonth
    : (Number(_country.price || _state.price) + 1) * _expirationMonth;

  data.number = phoneNumber;
  data.state = state || randomState;
  data.countryCode = _country.callingCode;
  data.areaCode = actualState?.callingCode || _country?.callingCode;
  data.state = _state.name;
  data.price = _price;
  data.description = assignDescToPhoneNumber(
    data.features,
    _expirationMonth,
    data.popularity,
    "europe"
  );
  data.tags = createTagsForNumber(
    _country.name,
    _price + "",
    phoneNumber,
    actualState?.callingCode || _country?.callingCode,
    "europe",
    data.features
  );

  return data;
};
