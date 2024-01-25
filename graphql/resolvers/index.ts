import { tokenResolvers } from "./tokenResolvers.js";
import { seriesResolvers } from "./seriesResolvers.js";
import { imageResolvers } from "./imageResolvers.js";
import { userResolvers } from "./userResolvers.js";
import { genresResolvers } from "./genresResolvers.js";
import { episodeResolvers } from "./episodeResolvers.js";
import { sourceResolvers } from "./sourceResolvers.js";
import { tagsResolvers } from "./tagsResolvers.js";

export const resolvers = {
  ...seriesResolvers,
  ...imageResolvers,
  ...userResolvers,
  ...genresResolvers,
  ...episodeResolvers,
  ...sourceResolvers,
  ...tokenResolvers,
  ...tagsResolvers,
};
