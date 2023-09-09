import Episode from "../../models/episode";
import Series from "../../models/series";
import { findSeries } from "../utils/series";

const transformEpisode = (episode: any) => {
  return {
    ...episode._doc,
    _id: episode.id,
    series: findSeries(episode._doc.series),
  };
};

export const episodeResolvers = {
  episodes: async () => {
    try {
      const result: any = await Episode.find();
      return result.map((episode: any) => {
        console.log(episode);
        return transformEpisode(episode);
      });
    } catch (error) {
      throw error;
    }
  },
  createEpisode: async (arg: any) => {
    try {
      const { title, epNum, source, seriesId } = arg.episodeInput;
      const series = await Series.findById(seriesId);
      if (!series) throw new Error("Can't find the series");
      const episode = new Episode({
        title,
        epNum,
        source,
        view: 0,
        series: seriesId,
      });
      const result: any = await episode.save();
      console.log(result);
      return transformEpisode(episode);
    } catch (error) {
      throw error;
    }
  },
};
