import { complaintEmail } from "./../helpers/emails";
import { ConversationModel, ComplaintModel } from "./../models/index";
import express from "express";
import {
  closeConnection,
  findUserByIdAndUpdate,
  httpStatusResponse,
  isStringAnEmail,
  joinNewsLetter,
  openConnectionPool,
  sendEmail,
} from "./../helpers/index";
import { sign, verify } from "jsonwebtoken";
import { ITokenPayload, IUser } from "types";
import dotenv from "dotenv";
import { JoinWaitListModel } from "../models/authentication";

dotenv.config();
const SECRET = process.env.JWT_SECRET || "";

export const decodeToken = async (token: string) => {
  const _decodedToken = verify(token, SECRET, {
    algorithms: ["HS256"],
  }) as ITokenPayload;

  return _decodedToken;
};

export const verifySessionIsStillActive = async (
  userId: string,
  exp: number,
  userEmail: string
) => {
  const currentTime = Date.now() / 1000; // Convert to seconds
  const twoHoursInSeconds = 60 * 60 * 2; // Two hours in seconds
  const timeDiff = exp - currentTime;

  if (!userId || !userEmail || !exp)
    throw new Error("Invalid or expired token");

  const shouldRefreshToken = timeDiff <= twoHoursInSeconds;
  const isSessionStillActive = timeDiff > 0;

  return {
    shouldRefreshToken,
    isSessionStillActive,
    remainingTime: timeDiff,
  };
};

// Function to refresh session token for a user
export const refreshSessionTokenForUser = async (
  token: string,
  res: express.Response
) => {
  try {
    const { userId, userEmail, exp } = await decodeToken(token);

    const _v = await verifySessionIsStillActive(userId, exp, userEmail);

    if (!_v) throw new Error("Invalid or expired token");

    if (_v.shouldRefreshToken) {
      const newToken = generateTokenForUser({
        id: userId,
        email: userEmail,
      } as IUser);

      await updateUserSession(userId, newToken, res);

      return { newToken, userId };
    }

    return { newToken: token, userId };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Function to update user session with new token
export const updateUserSession = async (
  userID: string,
  token: string,
  res: express.Response
) => {
  try {
    await findUserByIdAndUpdate(userID, {
      $set: {
        "authentication.sessionToken": token,
      },
    });

    const keepAliveForTheNextTwoDays = 60 * 60 * 24 * 2 * 1000;

    res.cookie("access-token", token, {
      maxAge: keepAliveForTheNextTwoDays,
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error updating user session:", error);
    throw new Error("Failed to update user session");
  }
};

// Function to generate a new token for a user
export const generateTokenForUser = (user: IUser) => {
  try {
    const token = sign(
      { userId: user.id, userEmail: user.email },
      SECRET, // Use PRIVATE_KEY if using RS256
      {
        algorithm: "HS256", // Change to "RS256" if using RS256
        expiresIn: "2d",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

//
export const _joinNewsLetter = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;

    if (!isStringAnEmail(email)) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "Please use a valid email address."));
    }

    await openConnectionPool();
    const hasJoined = await JoinWaitListModel.findOne({ email });

    if (hasJoined) {
      await closeConnection();
      return res
        .status(409)
        .json(
          httpStatusResponse(409, "Thanks, you already joined our wait-list!")
        );
    }

    await joinNewsLetter(email);
    await closeConnection();

    return res
      .status(201)
      .json(
        httpStatusResponse(
          200,
          "Thank you for joining our wait-list, we will send you an update once we have any."
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const messageSupport = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userEmail, name, message } = req.body;

    await openConnectionPool();

    const _complaint = await ComplaintModel.create({
      name,
      user: userEmail,
    });

    const emailTemplate = complaintEmail(userEmail, message);

    await ConversationModel.create({
      agent: null,
      user: message,
      complaintId: _complaint.id,
    });

    await sendEmail(process.env.HOST_EMAIL, emailTemplate, userEmail);

    await closeConnection();

    return res
      .status(201)
      .json(
        httpStatusResponse(
          200,
          "Thank you for your message we have received it and will reply as soon as possible"
        )
      );
  } catch (error) {
    console.log(error);
    await closeConnection();
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const getAccessTokenFromReq = async (req: express.Request) => {
  const access_token = req.headers.authorization;

  return access_token;
};
