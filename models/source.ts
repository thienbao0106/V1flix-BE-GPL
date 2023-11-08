import mongoose, { Schema } from "mongoose";

export const sourceSchema = new Schema({
  kind: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Sources", sourceSchema);
