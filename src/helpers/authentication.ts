import {
  decodeToken,
  getAccessTokenFromReq,
  refreshSessionTokenForUser,
  updateUserSession,
  verifySessionIsStillActive,
} from "./../controllers/index";
import {
  closeConnection,
  httpStatusResponse,
  openConnectionPool,
} from "./index";
import crypto from "crypto";
import express from "express";

const SECRET = "your-secret-key";
const JWT_SECRET = "";

// This is a bit function that helps to verify the user credential

// This is the function to be user
export const hashPassword = (salt: string, password: string): string => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

// Generate a random salt
export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

// This function will be use to compare password that user input and the hash password stored in the database
export const comparePassword = (
  intendedPassword: string,
  storedHash: string,
  salt: string
): boolean => {
  const hash = hashPassword(salt, intendedPassword);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
};

export const isUserAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.headers.authorization;

    await openConnectionPool();

    const _res = await refreshSessionTokenForUser(sessionToken, res);

    if (!_res) {
      await closeConnection();
      return res
        .status(401)
        .json(
          httpStatusResponse(401, "Please login before accessing this route.")
        );
    }

    req.userId = _res.userId;

    await closeConnection();

    next();
  } catch (error) {
    await closeConnection();
    console.log(error);
    return res.status(500).json(httpStatusResponse(500, "", error));
  }
};

export const verifyUserAuthentication = async (req: express.Request) => {
  const token = await getAccessTokenFromReq(req);

  if (!token) return null;

  const { userId, exp, userEmail } = await decodeToken(token);

  console.log({ userEmail, userId, exp });

  const isSessionStillActive = await verifySessionIsStillActive(
    userId,
    exp,
    userEmail
  );

  return { isSessionStillActive, userId };
};
