import { seriesResolvers } from "./seriesResolvers";
import { imageResolvers } from "./imageResolvers";
import { userResolvers } from "./userResolvers";
import { genresResolvers } from "./genresResolvers";

export const resolvers = {
  ...seriesResolvers,
  ...imageResolvers,
  ...userResolvers,
  ...genresResolvers,
};
