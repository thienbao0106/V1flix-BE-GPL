import { seriesResolvers } from "./series";
import { imageResolvers } from "./image";
import { userResolvers } from "./user";

export const resolvers = {
  ...seriesResolvers,
  ...imageResolvers,
  ...userResolvers,
};
