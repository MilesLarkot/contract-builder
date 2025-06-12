import mongoose from "mongoose";
import { FieldSchema } from "./field";

const SectionSchema = new mongoose.Schema({
  name: String,
  content: String,
  fields: [FieldSchema],
  description: String,
  category: String,
});

export default mongoose.models.Section ||
  mongoose.model("Section", SectionSchema);
