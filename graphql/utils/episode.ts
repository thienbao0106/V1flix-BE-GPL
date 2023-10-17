import Episode from "../../models/episode";
import { findSeries } from "./series";

export const findEpisodes = async (episodeIds: []): Promise<any> => {
  try {
    const result = await Episode.find({ _id: { $in: episodeIds } });
    return result.map((episode: any) => {
      console.log(episode);
      return {
        ...episode._doc,
        _id: episode.id,
        series: findSeries.bind(this, episode.series),
      };
    });
  } catch (error) {
    throw error;
  }
};
