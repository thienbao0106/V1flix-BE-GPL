import mongoose, { Schema } from "mongoose";

export const tokenSchema = new Schema({
  kind: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Tokens", tokenSchema);
