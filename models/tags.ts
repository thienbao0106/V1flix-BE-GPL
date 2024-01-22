import mongoose, { Schema } from "mongoose";

const tagsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  series: [
    {
      type: Schema.Types.ObjectId,
      ref: "Series",
    },
  ],
});

export default mongoose.model("Tags", tagsSchema);
