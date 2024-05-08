import Episode from "../../../models/episode";
import Series from "../../../models/series";
import { checkObject, paginateResult } from "../../utils/index";
import { transformEpisode } from "../../utils/episode";
import { thumbnails } from "./thumbnails";
import { description } from "./descriptions";
import { comments } from "./comments";
import { subtitles } from "./subtitles";

export const episodeResolvers = {
  episodes: async ({ pageNumber, limitPerPage, amount }: any) => {
    try {
      const { result, totalPage } = await paginateResult(
        Episode,
        pageNumber,
        limitPerPage,
        amount
      );

      return {
        currentPage: pageNumber + 1,
        totalPage,
        episodes: result.map((episode: any) => {
          console.log(episode);
          return transformEpisode(episode);
        }),
      };
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

      const episode = new Episode({
        title,
        epNum,
        source: source || [],
        view: 0,
        series: seriesId,
        created_at: date,
        updated_at: date,
        keyframe: keyframe || [],
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

      const updatedDate = Date.parse(new Date().toLocaleString());

      const result: any = await Episode.findByIdAndUpdate(
        episodeId,
        { ...episodeInput, updated_at: updatedDate },
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
      if (!episode) return;
      return transformEpisode(episode);
    } catch (error) {
      throw error;
    }
  },
  findEpisode: async ({ episodeId }: any) => {
    const episode: any = await Episode.findById(episodeId);
    if (!episode) return;
    return transformEpisode(episode);
  },

  //Fill episodes fields required
  fillEpisodeFields: async () => {
    try {
      const result: any = await Episode.updateMany({
        comments: [],
      });
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  ...thumbnails,
  ...description,
  ...comments,
  ...subtitles,
};
