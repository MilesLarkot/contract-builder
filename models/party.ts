import mongoose from "mongoose";
import { FieldSchema } from "./field";

export const PartySchema = new mongoose.Schema({
  role: String,
  fields: [FieldSchema],
});

export default mongoose.models.Party || mongoose.model("Party", PartySchema);
