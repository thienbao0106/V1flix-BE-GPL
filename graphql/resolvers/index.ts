import { tokenResolvers } from "./tokens/tokenResolvers";
import { seriesResolvers } from "./series/seriesResolvers";
import { imageResolvers } from "./images/imageResolvers";
import { userResolvers } from "./users/userResolvers";
import { genresResolvers } from "./genres/genresResolvers";
import { episodeResolvers } from "./episodes/episodeResolvers";
import { sourceResolvers } from "./sources/sourceResolvers";
import { tagsResolvers } from "./tags/tagsResolvers";

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
