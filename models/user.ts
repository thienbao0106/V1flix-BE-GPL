import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  list: [
    {
      series: {
        type: Schema.Types.ObjectId,
        ref: "Series",
      },
      status: {
        type: String,
        required: true,
      },
      currentEp: {
        type: Number,
        required: true,
      },
      note: {
        type: String,
        required: false,
      },
    },
  ],
});

export default mongoose.model("User", userSchema);
