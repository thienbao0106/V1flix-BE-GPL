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
    required: false,
  },
  thumbnail: {
    type: String,
    required: false,
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
    required: false,
  },
  updated_at: {
    type: Number,
    required: true,
  },
  keyframe: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sources",
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: Schema.Types.String,
        required: true,
      },
      created_at: {
        type: Number,
        required: true,
      },
      updated_at: {
        type: Number,
        required: true,
      },
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
