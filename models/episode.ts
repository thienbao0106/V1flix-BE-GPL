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
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  source: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sources",
    },
  ],
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
  keyframe: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sources",
    },
  ],
  subtitles: [
    {
      lang: {
        type: String,
        required: true,
      },
      source: [
        {
          type: Schema.Types.ObjectId,
          ref: "Sources",
        },
      ],

      label: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Episode", episodeSchema);
