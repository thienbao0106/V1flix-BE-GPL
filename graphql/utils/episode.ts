import Episode from "../../models/episode";
import { findSeries } from "./series";

export const findEpisodes = async (episodeIds: []): Promise<any> => {
  try {
    const result = await Episode.find({ _id: { $in: episodeIds } });
    return result.map((genres: any) => {
      return {
        ...genres._doc,
        _id: genres.id,
        series: findSeries.bind(this, genres.series),
      };
    });
  } catch (error) {
    throw error;
  }
};
