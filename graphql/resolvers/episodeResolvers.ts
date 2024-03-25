import Episode from "../../models/episode";
import Series from "../../models/series";
import { checkObject, paginateResult } from "../utils/index";
import { transformEpisode } from "../utils/episode";
import { getDescriptions, getThumbnails } from "../utils/kitsu";
import { crunchyrollScrap, wikipediaScrap } from "../utils/scrapData";
import { uploadEpisodeThumbToCloudinary } from "../utils/image";
import { findUserById } from "../utils/user";

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
  addSubtitle: async ({ subtitleInput, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return;
      const isExisted = episode.subtitles.find(
        (sub: any) => sub.lang === subtitleInput.lang
      );
      if (isExisted) return false;

      episode.subtitles.push(subtitleInput);
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

      episode.subtitles.push(subtitleInput);
      episode.save();
      return episode;
    } catch (error) {
      throw error;
    }
  },
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
  fillDescription: async ({ kitsuId, seriesId }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const descriptions = await getDescriptions(kitsuId, episodes.length);
      descriptions.map(async (des: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: des.epNum,
          },
          {
            $set: {
              description: des.description,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
  fillDescriptionByWiki: async ({ url, seriesId, skipElements }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const descriptions: any = await wikipediaScrap(
        url,
        episodes.length,
        skipElements
      );
      descriptions.map(async (des: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: des.epNum,
          },
          {
            $set: {
              description: des.description,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
  fillThumbnailsByCrunchy: async ({ url, seriesId, clickCount }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const results: any = await crunchyrollScrap(
        url,
        episodes.length,
        clickCount
      );

      const thumbnails = await Promise.all(
        results.map(async (item: any) => {
          console.log(item);
          const url = await uploadEpisodeThumbToCloudinary(
            item.thumb,
            series.title.main_title.toLowerCase().replaceAll(" ", "_"),
            item.epNum
          );
          return {
            epNum: item.epNum,
            thumb: url,
          };
        })
      );

      thumbnails.map(async (thumb: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: thumb.epNum,
          },
          {
            $set: {
              thumbnail: thumb.thumb,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
  fillThumbnails: async ({ kitsuId, seriesId }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      const series: any = await Series.findById(seriesId);
      const seriesTitle = series.title.main_title
        .toLowerCase()
        .replaceAll(" ", "_");
      if (!episodes) throw Error("Can't find this series");
      const thumbnails = await getThumbnails(
        kitsuId,
        episodes.length,
        seriesTitle
      );
      console.log("thumbnails------------");

      thumbnails.map(async (thumb: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            epNum: thumb.epNum,
          },
          {
            $set: {
              thumbnail: thumb.thumbnail,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
  addComments: async ({ episodeId, userId, content }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const newComment: any = {
        user: userId,
        content,
        created_at: date,
        updated_at: date,
      };

      const episode: any = await Episode.findByIdAndUpdate(
        episodeId,
        {
          $push: {
            comments: newComment,
          },
        },
        { returnDocument: "after" }
      );
      if (!episode) throw new Error("Can't add comment");
      const id: any = episode.comments[episode.length - 1]?._id;
      return {
        _id: id,
        ...newComment,
        user: findUserById(userId),
      };
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async ({ episodeId, commentId }: any) => {
    try {
      const episode = await Episode.findByIdAndUpdate(episodeId, {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      });
      if (!episode) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  editComment: async ({ episodeId, commentId, content }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const episode = await Episode.findOneAndUpdate(
        {
          _id: episodeId,
          "comments._id": commentId,
        },
        {
          $set: {
            "comments.$.content": content,
            "comments.$.updated_at": date,
          },
        }
      );
      // console.log("test comment");
      // console.log(episode?.comments);
      if (!episode) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
