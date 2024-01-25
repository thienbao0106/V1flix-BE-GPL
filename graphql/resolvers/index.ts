import { tokenResolvers } from "./tokenResolvers";
import { seriesResolvers } from "./seriesResolvers";
import { imageResolvers } from "./imageResolvers";
import { userResolvers } from "./userResolvers";
import { genresResolvers } from "./genresResolvers";
import { episodeResolvers } from "./episodeResolvers";
import { sourceResolvers } from "./sourceResolvers";
import { tagsResolvers } from "./tagsResolvers";

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
