import Episode from "../../models/episode";
import Series from "../../models/series";
import { checkObject } from "../utils";
import { fetchSource } from "../utils/onedrive";
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
      const { title, epNum, source, seriesId, keyframe } = arg.episodeInput;
      const date = Date.parse(new Date().toLocaleString());
      const series: any = await Series.findById(seriesId);
      if (!series) throw new Error("Can't find the series");

      const isDuplicated = await Episode.findOne({
        epNum,
        series: seriesId,
      });
      if (isDuplicated) throw new Error("This episode is already existed");

      const sourceUrl = await fetchSource(
        source,
        process.env.ACCESS_TOKEN || ""
      );
      const keyframeUrl = await fetchSource(
        keyframe,
        process.env.ACCESS_TOKEN || ""
      );
      const episode = new Episode({
        title,
        epNum,
        source: sourceUrl,
        view: 0,
        series: seriesId,
        created_at: date,
        updated_at: date,
        keyframe: keyframeUrl || "",
      });
      const result: any = await episode.save();
      series.episodes.push(result._id);
      series.save();
      return transformEpisode(episode);
    } catch (error) {
      throw error;
    }
  },
  updateEpisode: async ({ episodeInput, episodeId }: any) => {
    try {
      checkObject(episodeInput, "episode");
      const newEpisode = Object.assign(episodeInput);
      const updatedDate = Date.parse(new Date().toLocaleString());
      if (newEpisode.source) {
        newEpisode.source = await fetchSource(
          newEpisode.source,
          process.env.ACCESS_TOKEN || ""
        );
      }
      if (newEpisode.keyframe) {
        newEpisode.keyframe = await fetchSource(
          newEpisode.keyframe,
          process.env.ACCESS_TOKEN || ""
        );
      }
      const result: any = await Episode.findByIdAndUpdate(
        episodeId,
        { ...newEpisode, updated_at: updatedDate },
        {
          returnDocument: "after",
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteEpisode: async ({ episodeId }: any) => {
    try {
      const result: any = await Episode.findByIdAndRemove(episodeId);
      const series: any = await Series.findById(result.series);
      series.episodes = [...series.episodes].filter(
        (episode: String) => episode === episodeId
      );
      series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  searchEpisode: async ({ seriesId, epNum }: any) => {
    try {
      const episode: any = await Episode.findOne({ series: seriesId, epNum });
      if (episode === null) return;
      return transformEpisode(episode);
    } catch (error) {
      throw error;
    }
  },
  addSubtitle: async ({ subtitleInput, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return;
      const isExisted = episode.subtitles.find(
        (sub: any) => sub.lang === subtitleInput.lang
      );
      if (isExisted) return false;
      const subtitle = Object.assign({}, subtitleInput);
      subtitle.source = await fetchSource(
        subtitle.source,
        process.env.ACCESS_TOKEN || ""
      );
      episode.subtitles.push(subtitle);
      episode.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSubtitle: async ({ lang, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return false;

      episode.subtitles = [...episode.subtitles].filter(
        (sub: any) => sub.lang !== lang
      );
      console.log(episode.subtitles);
      episode.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateSubtitle: async ({ subtitleInput, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return;
      episode.subtitles = [...episode.subtitles].filter(
        (sub: any) => sub.lang !== subtitleInput.lang
      );
      const subtitle = Object.assign({}, subtitleInput);
      subtitle.source = await fetchSource(
        subtitle.source,
        process.env.ACCESS_TOKEN || ""
      );
      episode.subtitles.push(subtitle);
      episode.save();
      return episode;
    } catch (error) {
      throw error;
    }
  },
};
