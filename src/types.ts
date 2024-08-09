import { JwtPayload } from "jsonwebtoken";
import { CountryCode } from "libphonenumber-js";

export type verificationMeans = "email" | "phoneNumber";
export type authType = "google" | "local";

export interface IAuthentication {
  salt?: string;
  password?: string;
  sessionToken: string;
  authType: authType;
}

export interface IUser {
  id: string;
  email: string;
  phoneNumber: string;
  countryCode?: CountryCode;
  isAccountActive: boolean;
  isAccountVerified: boolean;
  authentication: IAuthentication;
  verificationMeans?: verificationMeans;
}

export interface ITokenPayload extends JwtPayload {
  userId: string;
  userEmail: string;
}

export type customStatus = {
  status:
    | "FORGOT-PASSWORD"
    | "NO-ACCOUNT"
    | "LOGIN"
    | "VERIFY-EMAIL"
    | "NOT-YET-AVAILABLE";
};

export interface IVerifyAccount {
  userId: string;
  code: string;
  expires_at: number;
}

export interface IForgetPassword extends IVerifyAccount {
  requestCount: number;
  lastRequested: number;
}

export interface IJoinWaitList {
  email: string;
}

export interface IComplaint {
  user: string;
  name: string;
}

export interface IConversation {
  user: string;
  agent: string;
  complaintId: string;
}

export interface IGoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
}

export type availableNumberTypes = "usa-special-numbers" | "normal";
export type phoneNumberFeatures = "sms" | "voice-call" | "voice-mail";
//1111111111111111111111111111111111111

export interface IPhoneNumbers {
  country: string;
  state?: string;
  number: string;
  areaCode: string;
  price: number;
  type: availableNumberTypes;
  countryCode?: string;
  activationStatus?: boolean;
  features?: phoneNumberFeatures[]; // e.g., ['SMS', 'Voice']
  expirationDate?: number;
  description?: string;
  tags?: string[];
  popularity?: number; // e.g., number of times sold
  region?: "europe";
  stock: number;
}

export interface ICustomerReview {
  rating: number;
  comment: string;
  created_at: number;
  phoneNumberId: string;
}
//

export interface stateProps {
  callingCode: string;
  phoneNumberLength: number;
  price?: string;
}

export interface IEuropeCountriesProps {
  name: string;
  price: string;
  callingCode: string;
  phoneNumberLength: number;
  states: Record<string, stateProps>;
}

export interface ICountryCallingCode {
  country: IEuropeCountriesProps;
}
