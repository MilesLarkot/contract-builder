import mongoose from "mongoose";
import FieldSchema from "./field";

const PartySchema = new mongoose.Schema({
  role: String,
  fields: [FieldSchema],
});

export default mongoose.models.Field || mongoose.model("Party", PartySchema);
