import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: "Series",
  },
});

export default mongoose.model("Image", imageSchema);
