import Episode from "../../models/episode";
import { fetchSource } from "./onedrive";
import { findSeries } from "./series";

export const transformEpisode = (episode: any) => {
  const sourceUrl = fetchSource(
    episode._doc.source,
    process.env.ACCESS_TOKEN || ""
  );
  const keyframeUrl =
    episode._doc.keyframe !== ""
      ? fetchSource(episode._doc.keyframe, process.env.ACCESS_TOKEN || "")
      : episode._doc.keyframe;
  const subtitlesUrl = episode._doc.subtitles.map((sub: any) => {
    const subClone = Object.assign({}, sub._doc);
    subClone.source = fetchSource(
      subClone.source,
      process.env.ACCESS_TOKEN || ""
    );
    return subClone;
  });
  return {
    ...episode._doc,
    _id: episode.id,
    series: findSeries(episode._doc.series),
    source: sourceUrl,
    keyframe: keyframeUrl,
    subtitles: subtitlesUrl,
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
