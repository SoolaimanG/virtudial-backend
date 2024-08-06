import { IComplaint, IConversation, IPhoneNumbers } from "./../types";
import { Schema, model } from "mongoose";

const ComplaintSchema = new Schema<IComplaint>({
  name: { type: String, required: true },
  user: { type: String, required: true },
});

const ConversationSchema = new Schema<IConversation>({
  agent: { type: String, required: false, default: null },
  user: { type: String, required: true },
  complaintId: { type: String, required: true },
});

const PhoneNumberSchema = new Schema<IPhoneNumbers>({
  activationStatus: { type: Boolean, default: false },
  areaCode: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  description: { type: String },
  expirationDate: { type: Number, required: true },
  features: { type: [String], default: [] },
  number: { type: String, required: true },
  popularity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  region: { type: String, default: "europe" },
  state: { type: String, default: null },
  stock: { type: Number },
  tags: { type: [String], default: [] },
  type: {
    type: String,
    enum: ["usa-special-numbers", "normal"],
    default: "normal",
    required: true,
  },
});

export const ComplaintModel = model("complaint", ComplaintSchema);
export const ConversationModel = model("conversation", ConversationSchema);
export const PhoneNumberModel = model("phoneNumber", PhoneNumberSchema);
//
