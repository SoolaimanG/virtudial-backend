import { domain } from "./../index";
import dotenv from "dotenv";
import {
  ForgetPasswordModel,
  UserModel,
  VerifyAccountModel,
} from "./../models/authentication";
import { generateTokenForUser, updateUserSession } from "./index";
import {
  comparePassword,
  generateSalt,
  hashPassword,
  isUserAuthenticated,
  verifyUserAuthentication,
} from "./../helpers/authentication";
import {
  allowSpecifiedAuthentication,
  closeConnection,
  findUserByEmail,
  findUserById,
  findUserByIdAndUpdate,
  findUserByPhoneNumber,
  generateOTP,
  httpStatusResponse,
  isPasswordStrong,
  isStringAnEmail,
  joinNewsLetter,
  openConnectionPool,
  returnUser,
  sendEmail,
  sendMessageToPhoneNumber,
} from "./../helpers/index";
import express from "express";
import parsePhoneNumber from "libphonenumber-js";
import { forgetPasswordEmail, verifyEmail } from "../helpers/emails";
import axios from "axios";
import { IGoogleUser } from "types";

dotenv.config();

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      email,
      password,
      phoneNumber,
      countryCode,
      agreeToAdvertisingEmails,
    } = req.body;

    if (!(email && password && phoneNumber)) {
      return res.status(400).json(httpStatusResponse(400));
    }

    if (!isStringAnEmail(email)) {
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "Please a valid email address to create an account"
          )
        );
    }

    const parse = parsePhoneNumber(phoneNumber, countryCode || "NG");

    if (!parse.isValid()) {
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "Please use a valid phone number for creating an account, Thank you"
          )
        );
    }

    if (!isPasswordStrong(password)) {
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "Password does not meet the password requirement, password is not strong enough"
          )
        );
    }

    await openConnectionPool();
    const user = await (findUserByEmail(email) ||
      findUserByPhoneNumber(phoneNumber));

    if (user) {
      await closeConnection();
      return res
        .status(409)
        .json(
          httpStatusResponse(
            409,
            "An account with this email or phone number already exist please try logging into the app",
            null,
            { status: "LOGIN" }
          )
        );
    }

    // If the user agree to advertising emails then we add them to one.
    if (agreeToAdvertisingEmails) await joinNewsLetter(email);

    const SALT = generateSalt();
    const _hashPassword = hashPassword(SALT, password);

    const _user = new UserModel({
      email,
      phoneNumber,
      isAccountVerified: false,
      authentication: {
        password: _hashPassword,
        salt: SALT,
        authType: "local",
      },
    });

    await _user.save();

    await closeConnection();

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "Account created successfully, please proceed to verify your email address.",
          returnUser(user)
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const loginUserByLocalAuthentication = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password, phoneNumber } = req.body;

    // This will make sure valid credentials are passed in.
    if (!((email || phoneNumber) && password)) {
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "Missing required parameters email or password or phoneNumber"
          )
        );
    }

    if (phoneNumber === "+23400000000") {
      return res
        .status(409)
        .json(
          httpStatusResponse(409, "Please use a valid phone number to login")
        );
    }

    await openConnectionPool();
    const user = await (findUserByEmail(email, { includePassword: true }) ||
      findUserByPhoneNumber("+" + phoneNumber, { includePassword: true }));

    if (!user) {
      await closeConnection();
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "User with this email or phone Number does not exist yet"
          )
        );
    }

    const isPasswordMatching = comparePassword(
      password,
      user.authentication.password,
      user.authentication.salt
    );

    if (!isPasswordMatching) {
      await closeConnection();
      return res
        .status(409)
        .json(
          httpStatusResponse(
            409,
            "Incorrect password, if you are trying to login and you can't remember your credentials, please use the forget password button"
          )
        );
    }

    await allowSpecifiedAuthentication(user.id);

    // if (!user.isAccountActive) {
    //   return res
    //     .status(401)
    //     .json(
    //       httpStatusResponse(
    //         401,
    //         "Your account has been locked due to violation of our policy, please contact support."
    //       )
    //     );
    // }

    // Create a session token for the user here
    const token = generateTokenForUser(user);

    // Update the user token
    await updateUserSession(user.id, token, res);
    await closeConnection();

    return res.status(200).json(
      httpStatusResponse(200, "Logged in successfully", {
        ...returnUser(user),
        token,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const requestOTP = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, phoneNumber, verificationMeans = "email" } = req.body;

    let newOtp;

    if (!(email || phoneNumber)) {
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "Missing required parameters email or phoneNumber or code"
          )
        );
    }

    await openConnectionPool();
    const user = await (findUserByEmail(email) ||
      findUserByPhoneNumber(phoneNumber));

    if (!user) {
      await closeConnection();
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "User with this email or phoneNumber does not exist yet"
          )
        );
    }

    //TODO: if (!user.isAccountActive) {
    //   await closeConnection();
    //   return res
    //     .status(401)
    //     .json(
    //       httpStatusResponse(
    //         401,
    //         "Your account has been locked due to violation of our policy, please contact support."
    //       )
    //     );
    // }

    if (user.isAccountVerified) {
      await closeConnection();
      return res
        .status(409)
        .json(
          httpStatusResponse(
            409,
            "It looks like you already verified your account, please proceed to login"
          )
        );
    }

    const otp = generateOTP(6);
    const expires_at = Date.now() + 60 * 10 * 1000;

    if (verificationMeans === "phoneNumber") {
      // Phone Number OTP Verification is not yet available
      return res
        .status(400)
        .json(
          httpStatusResponse(400, "", null, { status: "NOT-YET-AVAILABLE" })
        );

      const _parse = parsePhoneNumber(user.phoneNumber, user.countryCode);

      const userPhoneNumber = `+${_parse.countryCallingCode}${user.phoneNumber}`;
      const body = `Here is your 6-digit OTP to verify your account ${otp}`;

      await sendMessageToPhoneNumber(body, userPhoneNumber);
    } else {
      const sendOTPTemplate = verifyEmail(otp);

      await sendEmail(user.email, sendOTPTemplate);
    }

    await openConnectionPool();

    const alreadySentOTP = await VerifyAccountModel.findOne({
      userId: user.id,
    });

    if (alreadySentOTP) {
      newOtp = await VerifyAccountModel.findByIdAndUpdate(alreadySentOTP.id, {
        expires_at,
        code: otp,
      });
    } else {
      const _OTP = new VerifyAccountModel({
        code: otp,
        expires_at,
        userId: user.id,
      });

      newOtp = await _OTP.save();
    }

    await findUserByIdAndUpdate(user.id, {
      verificationMeans,
    });

    await closeConnection();

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "OTP code sent successfully, please verify your account",
          { verificationMeans, id: newOtp.id, expires_at }
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const verifyAccount = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    //
    const { id } = req.params;
    const { code } = req.body;

    await openConnectionPool();
    const token = await VerifyAccountModel.findById(id);

    // Check if the token has expired
    const currentTime = Date.now();

    if (token.expires_at < currentTime) {
      await closeConnection();
      return res
        .status(409)
        .json(
          httpStatusResponse(
            409,
            "Looks like this token has expired, please request a new one, Thank you."
          )
        );
    }

    if (token.code !== code.toString().trim()) {
      await closeConnection();
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "The code you provided is incorrect, please make sure you are putting in the correct code or request a new code."
          )
        );
    }

    const user = await findUserByIdAndUpdate(token.userId, {
      isAccountVerified: true,
    });

    const _token = generateTokenForUser(user);
    await updateUserSession(user.id, _token, res);

    await token.deleteOne();
    1;
    await closeConnection();

    return res
      .status(200)
      .json(
        httpStatusResponse(200, "Your account has been successfully verified")
      );

    // If the code matches
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const requestPasswordReset = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, phoneNumber } = req.body;
    //
    if (!(email || phoneNumber)) {
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "Missing required parameter: email or phoneNumber is required"
          )
        );
    }

    await openConnectionPool();

    const user = await (findUserByEmail(email) ||
      findUserByPhoneNumber(phoneNumber));

    if (!user) {
      await closeConnection();
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "User with the given credentials not found in the database"
          )
        );
    }

    const currentTime = Date.now();

    const token = generateSalt();
    const _tenMins = 60 * 10 * 1000;
    const expires_at = currentTime + _tenMins;

    const fp = await ForgetPasswordModel.findOne({ userId: user.id });

    if (fp) {
      const _addToCoolOff = fp.requestCount * 60 * 1000; // Each request adds 30 seconds
      const lastRequested = fp.lastRequested || 0; // Ensure lastRequested is defined
      const COOL_OFF = lastRequested + _addToCoolOff;

      if (COOL_OFF > currentTime) {
        await closeConnection();
        return res
          .status(429)
          .json(
            httpStatusResponse(
              429,
              `Please make your next request after ${new Date(
                COOL_OFF
              ).toLocaleString()}`
            )
          );
      }

      await ForgetPasswordModel.findOneAndUpdate(
        { userId: user.id },
        {
          expires_at,
          code: token,
          lastRequested: currentTime,
          requestCount: fp.requestCount + 1,
        }
      );
    } else {
      await ForgetPasswordModel.create({
        code: token,
        expires_at,
        userId: user.id,
        requestCount: 1,
        lastRequested: currentTime,
      });
    }

    const resetLink = domain(5173) + "/reset-password/" + token;

    //
    const emailTemplate = forgetPasswordEmail("user", resetLink);

    await sendEmail(
      user.email,
      emailTemplate,
      undefined,
      "Change password request"
    );
    //
    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "An email with instructions on how to reset your password has been sent to the email address you provided"
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const changePassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const _isPasswordStrong = isPasswordStrong(password as string);

    if (!_isPasswordStrong) {
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "Password does not meet the password requirement, password is not strong enough"
          )
        );
    }

    await openConnectionPool();

    const request = await ForgetPasswordModel.findOne({ code: id });

    if (!request) {
      await closeConnection();
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "This request was not found, this could be that you haven't request a password change"
          )
        );
    }

    const user = await findUserById(request.userId, { includePassword: true });

    const SALT = generateSalt();

    const _hashPassword = hashPassword(SALT, password as string);

    const _comparePassword = comparePassword(
      password,
      user.authentication.password,
      user.authentication.salt
    );

    if (_comparePassword) {
      return res
        .status(409)
        .json(
          httpStatusResponse(
            409,
            "Please use a different password, you cannot use your previous password"
          )
        );
    }

    await findUserByIdAndUpdate(request.userId, {
      $set: {
        "authentication.password": _hashPassword,
        "authentication.salt": SALT,
      },
    });
    await request.deleteOne();

    await closeConnection();

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "Your password has been changes successfully, you can login with your new password"
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const getVerificationRequestStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json(httpStatusResponse(404, "", {}));
    }

    await openConnectionPool();
    const verificationStatus = await VerifyAccountModel.findById(id);

    if (!verificationStatus) {
      await closeConnection();
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "A verify account request with this Id is not found in out database"
          )
        );
    }

    const user = await findUserById(verificationStatus.userId);
    await closeConnection();
    //
    return res.status(200).json(
      httpStatusResponse(200, "", {
        email: user.email,
        phoneNumber: user.phoneNumber,
      })
    );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};
//
export const continueWithGoogle = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { access_token } = req.body;

    const googleUser: { data: IGoogleUser } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    await openConnectionPool();
    const user = await findUserByEmail(googleUser.data.email);

    // If the user is not found in our data base please create user record
    if (!user) {
      const newUser = await UserModel.create({
        countryCode: "NG",
        email: googleUser.data.email,
        isAccountVerified: googleUser.data.verified_email,
        verificationMeans: "email",
        isAccountActive: true,
        phoneNumber: "+23400000000",
        authentication: {
          authType: "google",
        },
      });

      const token = generateTokenForUser(newUser);
      await updateUserSession(newUser.id, token, res);

      await closeConnection();

      return res.status(200).json(
        httpStatusResponse(200, "Login successful", {
          ...returnUser(user),
          firstTimeLogin: true,
          token,
        })
      );
    }

    await allowSpecifiedAuthentication(user.id, "google");

    const token = generateTokenForUser(user);
    await updateUserSession(user.id, token, res);

    await closeConnection();

    return res.status(200).json(
      httpStatusResponse(200, "Login successful", {
        ...returnUser(user),
        token,
      })
    );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const completeAccountSetup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, phoneNumber, agreeToAdvertisingEmails } = req.body;

    await openConnectionPool();
    const _token = await verifyUserAuthentication(req);

    if (!_token?.isSessionStillActive) {
      await closeConnection();
      return res
        .status(401)
        .json(
          httpStatusResponse(
            401,
            "Please login to access this request",
            {},
            { status: "LOGIN" }
          )
        );
    }

    const user = await findUserById(_token?.userId);

    if (!user) {
      await closeConnection();
      return res
        .status(404)
        .json(httpStatusResponse(404, "User not found in our database."));
    }

    if (agreeToAdvertisingEmails) await joinNewsLetter(user?.email);

    const isAccountVerified = email === user.email;

    const updatedUser = await findUserByIdAndUpdate(_token?.userId, {
      email,
      phoneNumber,
      isAccountVerified,
    });

    await closeConnection();

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "Your profile has been completed, thank you for choosing us.",
          returnUser(updatedUser)
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, undefined, error));
  }
};

export const checkIsUserAuthenticated = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    await openConnectionPool();
    const userId = req.userId;
    const user = await findUserById(userId);

    await closeConnection();

    return res
      .status(200)
      .json(httpStatusResponse(200, "User is authenticated", returnUser(user)));
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};
