import mongoose, { Schema } from "mongoose";

const seriesSchema = new Schema({
  title: {
    main_title: {
      type: String,
      required: true,
    },
    alt_title: {
      type: String,
      required: true,
    },
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
  view: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Number,
    required: false,
  },
  updated_at: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  favors: {
    type: Number,
    required: false,
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
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
  episodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
  trailer: {
    id: {
      type: String,
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  relation: [
    {
      role: {
        type: String,
      },
      related_series: {
        type: Schema.Types.ObjectId,
        ref: "Series",
      },
    },
  ],
  rating: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Series", seriesSchema);
