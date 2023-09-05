import { seriesResolvers } from "./series";
import { imageResolvers } from "./images";

export const resolvers = {
  ...seriesResolvers,
  ...imageResolvers,
};
