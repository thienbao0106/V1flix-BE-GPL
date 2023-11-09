import Episode from "../../models/episode";

import { findSeries } from "./series";
import { transferMultipleSource } from "./source";

const handleSubtitles = (subtitles: any[]) => {
  return subtitles.map((sub) => {
    return {
      lang: sub.lang,
      label: sub.label,
      source: transferMultipleSource(sub.source),
    };
  });
};

export const transformEpisode = (episode: any) => {
  return {
    ...episode._doc,
    _id: episode.id,
    series: findSeries(episode._doc.series),
    source: transferMultipleSource(episode._doc.source),

    subtitles: handleSubtitles.bind(this, episode._doc.subtitles),
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
