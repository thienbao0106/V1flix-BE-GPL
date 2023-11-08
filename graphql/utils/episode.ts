import Episode from "../../models/episode";

import { findSeries } from "./series";
import { transferMultipleSource } from "./source";

const handleSubtitles = (subtitles: any[]) => {
  const listSubtitles = subtitles.map((sub) => {
    return {
      ...sub,
      source: transferMultipleSource(sub.source),
    };
  });
  return listSubtitles;
};

export const transformEpisode = (episode: any) => {
  return {
    ...episode._doc,
    _id: episode.id,
    series: findSeries(episode._doc.series),
    source: transferMultipleSource(episode._doc.source),

    // subtitles: handleSubtitles(episode._doc.subtitles),
    keyframe: transferMultipleSource(episode._doc.keyframe),
  };
};

export const findEpisodes = async (episodeIds: []): Promise<any> => {
  try {
    const result = await Episode.find({ _id: { $in: episodeIds } });
    return result.map((episode: any) => {
      console.log(episode);
      return transformEpisode(episode);
    });
  } catch (error) {
    throw error;
  }
};
