import Episode from "../../models/episode";

import { findSeries } from "./series";
import { transferMultipleSource } from "./source";
import { findUserById } from "./user";

const handleSubtitles = (subtitles: any[]) => {
  return subtitles
    .sort((itemA, itemB) => itemA - itemB)
    .map((sub) => {
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
    comments: episode._doc.comments.map((comment: any) => {
      return {
        ...comment._doc,
        user: findUserById(comment.user),
      };
    }),
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
