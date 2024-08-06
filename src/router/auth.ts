import { isUserAuthenticated } from "./../helpers/authentication";
import {
  changePassword,
  checkIsUserAuthenticated,
  completeAccountSetup,
  continueWithGoogle,
  createUser,
  getVerificationRequestStatus,
  loginUserByLocalAuthentication,
  requestOTP,
  requestPasswordReset,
  verifyAccount,
} from "./../controllers/authentication";
import express from "express";

const authRouter = express.Router();

// User created an account
authRouter.post("/create", createUser);

// User login
authRouter.post("/local-sign-in", loginUserByLocalAuthentication);

// request verification code on email address or phoneNumber
authRouter.post("/request-verification", requestOTP);

// Verify account
authRouter.post("/verify-account/:id", verifyAccount);

// User wants to reset password
authRouter.post("/request-password-change", requestPasswordReset);

authRouter.post("/continue-with-google/", continueWithGoogle);

authRouter.post("/complete-account-set-up", completeAccountSetup);
//

authRouter.get(
  "/is-user-authenticated",
  isUserAuthenticated,
  checkIsUserAuthenticated
);
//

authRouter.get(
  "/get-verification-request-status/:id/",
  getVerificationRequestStatus
);

authRouter.post("/change-password/:id/", changePassword);

export default (): express.Router => {
  return authRouter;
};
