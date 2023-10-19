import mongoose, { Schema } from "mongoose";

const episodeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  epNum: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    required: true,
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: "Series",
  },
  created_at: {
    type: Number,
    require: false,
  },
  updated_at: {
    type: Number,
    require: true,
  },
  subtitles: [
    {
      lang: {
        type: String,
        required: true,
      },
      source: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Episode", episodeSchema);
