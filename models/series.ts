import mongoose, { Schema } from "mongoose";

const seriesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  total_episodes: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
  genres: [
    {
      type: Schema.Types.ObjectId,
      ref: "Genres",
    },
  ],
  episodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
});

export default mongoose.model("Series", seriesSchema);
