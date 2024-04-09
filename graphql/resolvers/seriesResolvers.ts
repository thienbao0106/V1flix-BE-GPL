import Genres from "../../models/genres";
import Image from "../../models/image";
import Series from "../../models/series";
import User from "../../models/user";
import Episode from "../../models/episode";
import Tags from "../../models/tags";
import { checkObject, paginateResult } from "../utils/index";
import { findSeries, getYoutubeId, transformSeries } from "../utils/series";
import { getALImages, getALShow } from "../utils/anilist";
import { formatString } from "../utils/string";
import { addSeriesToTag, getTagsId } from "../utils/tags";
import { addSeriesToGenres, getGenresId } from "../utils/genres";
import { findUserById, modifyList, sumMeanScore } from "../utils/user";

export const seriesResolvers = {
  series: async ({ pageNumber, limitPerPage, amount }: any) => {
    try {
      const { result, totalPage } = await paginateResult(
        Series,
        pageNumber,
        limitPerPage,
        amount
      );

      return {
        currentPage: pageNumber + 1,
        totalPage,
        series: result.map((series: any) => {
          return transformSeries(series);
        }),
      };
    } catch (error) {
      throw error;
    }
  },
  findSeries: async ({ title, numOfLimit, genresId, status }: any) => {
    try {
      const isGenres = genresId !== "" &&
        genresId && {
          genres: {
            $elemMatch: {
              $eq: genresId,
            },
          },
        };

      const isStatus = status !== "" &&
        status && {
          status,
        };
      const result = await Series.find({
        "title.main_title": {
          $regex: title,
          $options: "i",
        },
        ...isGenres,
        ...isStatus,
      }).limit(numOfLimit);

      if (result.length > 0) {
        return result.map((series: any) => {
          return transformSeries(series);
        });
      }

      return [];
    } catch (error) {
      throw error;
    }
  },
  createSeries: async (args: any, req: any) => {
    try {
      // if (!req.isAuth) throw new Error("Unauthenticated");
      const date = Date.parse(new Date().toLocaleString());
      const {
        main_title,
        alt_title,
        description,
        total_episodes,
        type,
        season,
        status,
        duration,
      } = args.seriesInput;
      const series = new Series({
        title: {
          main_title,
          alt_title,
        },
        description,
        total_episodes,
        type,
        season,
        status,
        view: 0,
        duration,
        created_at: date,
        updated_at: date,
        favors: 0,
      });
      const result: any = await series.save();
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  updateSeries: async ({ seriesInput, seriesId }: any) => {
    checkObject(seriesInput, "series");
    const updatedDate = Date.parse(new Date().toLocaleString());

    try {
      const result = await Series.findByIdAndUpdate(
        seriesId,
        { ...seriesInput, updated_at: updatedDate },
        {
          returnDocument: "after",
        }
      );
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  deleteSeries: async ({ seriesId }: any) => {
    try {
      const result: any = await Series.findByIdAndDelete(seriesId);
      result.images.map(async (imageId: String) => {
        await Image.findByIdAndDelete(imageId);
        return;
      });

      //To-do: Upgrade this block of code
      Genres.updateMany(
        { series: seriesId },
        {
          $pull: { series: seriesId },
        }
      );

      Tags.updateMany(
        { series: seriesId },
        {
          $pull: { series: seriesId },
        }
      );

      const listUser: any = await User.find({ series: seriesId });
      if (listUser.length > 0) {
        listUser.map((list: any) => {
          list.series = [...list.series].filter(
            (id: String) => id === seriesId
          );
          list.save();
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
  addView: async ({ seriesId, episodeId }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      console.log(series.view);
      const episode: any = await Episode.findById(episodeId);
      series.view += 1;
      episode.view += 1;
      series.save();
      episode.save();
      return series._doc.view;
    } catch (error) {
      throw error;
    }
  },
  addFavoriteSeries: async ({ userId, seriesId }: any) => {
    try {
      const user: any = await User.findById(userId);
      const series: any = await Series.findById(seriesId);
      if (!user || !series) return false;
      const isDuplicate = user.favoriteList.find(
        (series: any) => series._id == seriesId
      );
      if (isDuplicate) return false;
      user.favoriteList.push(series);
      series.favors = series.favors + 1;
      await user.save();
      await series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteFavoriteSeries: async ({ userId, seriesId }: any) => {
    try {
      const user: any = await User.findById(userId);
      const series: any = await Series.findById(seriesId);
      if (!user || !series) return false;
      user.favoriteList = [...user.favoriteList].filter(
        (series) => series._id != seriesId
      );
      series.favors = series.favors - 1;
      await user.save();
      await series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  randomSeries: async () => {
    try {
      const series: any = await Series.aggregate([
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      return transformSeries(series[0]);
    } catch (error) {
      throw error;
    }
  },
  findSeriesByIds: async ({ listSeries }: any) => {
    try {
      return listSeries.map((seriesId: string) => {
        return findSeries(seriesId);
      });
    } catch (error) {
      throw error;
    }
  },
  findSeriesByName: async ({ seriesTitle, isRelation }: any) => {
    try {
      const result = await Series.findOne({
        "title.main_title": seriesTitle,
      });
      if (!result) throw new Error("Can't find this series!");
      return transformSeries(result, isRelation);
    } catch (error) {
      throw error;
    }
  },
  //Only for Youtube trailer
  addTrailer: async ({ idSeries, trailerUrl }: any) => {
    try {
      const idTrailer = getYoutubeId(trailerUrl);
      const result = await Series.findByIdAndUpdate(idSeries, {
        $push: {
          trailer: {
            idTrailer,
            thumbnail: `https://i.ytimg.com/vi/${idTrailer}/hqdefault.jpg`,
            site: "youtube",
          },
        },
      });
      if (result) return true;
      return false;
    } catch (error) {
      throw error;
    }
  },
  addSeriesByAnilist: async ({ id }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const alSeries: any = await getALShow(id);
      const {
        title,
        description,
        episodes,
        format,
        seasonYear,
        season,
        status,
        duration,
        trailer,
        tags,
        genres,
      } = alSeries.Media;
      const tagsArr = await getTagsId(tags);
      const genresArr = await getGenresId(genres);
      const trailers = [{ ...trailer, idTrailer: trailer.id }];
      const series = new Series({
        title: {
          main_title: title.romaji.replace(/"/g, ""),
          alt_title: title.english.replace(/"/g, ""),
        },
        description,
        total_episodes: episodes || 0,
        type: format,
        season: `${formatString(season)} ${seasonYear}`,
        status: formatString(status === "FINISHED" ? "completed" : status),
        view: 0,
        duration,
        created_at: date,
        updated_at: date,
        favors: 0,
        trailer: trailers,
        genres: genresArr,
        tags: tagsArr,
      });
      const result: any = await series.save();
      console.log("Result Id: " + result._id);
      addSeriesToTag(tagsArr, result._id);
      addSeriesToGenres(genresArr, result._id);
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  addRelation: async ({
    relationInput: { idSeries, idRelatedSeries, role },
  }: any) => {
    try {
      const series = await Series.findByIdAndUpdate(idSeries, {
        $addToSet: {
          relation: {
            role,
            related_series: idRelatedSeries,
          },
        },
      });
      if (!series) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  fillImages: async ({ anilistId, seriesId }: any) => {
    try {
      const series: any = await Series.findById(seriesId);

      const title = series.title.main_title.toLowerCase().replaceAll(" ", "_");
      const images = await getALImages(anilistId, title, series._id);
      const result = await Image.insertMany(images);
      console.log("result-----");
      console.log(result);
      const resultIds = result.map((item: any) => item._id);
      series.images = resultIds;
      series.save();

      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSeriesImages: async ({ seriesId }: any) => {
    try {
      await Image.deleteMany({
        series: seriesId,
      });
      const series = await Series.findByIdAndUpdate(seriesId, {
        images: [],
      });
      if (!series) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  addRating: async ({ userId, seriesId, score }: any) => {
    try {
      const series = await Series.findById(seriesId);
      if (!series) return;
      const found = series.rating.find((rate: any) => rate.user == userId);
      if (!found) series.rating.push({ user: userId, score });
      else {
        const filteredArr = series.rating.filter((rate) => rate.user != userId);
        filteredArr.push({ user: userId, score });
        series.rating = filteredArr;
      }
      //Update user's mean score
      const user: any = await User.findById(userId);
      console.log("test");
      console.log(user.list);
      if (user.list.length <= 1) user.stats.mean_score = score;
      else {
        const modifiedList = await modifyList(user.list);
        console.log("modified list");
        console.log(modifiedList);
        const list = modifiedList.filter(
          (item: any) => item.series._id !== seriesId
        );
        const result =
          (await sumMeanScore(list, userId, true)) + (score / list.length + 1);
        user.stats.mean_score = parseFloat(result.toFixed(2));

        console.log("mean-score");
        console.log(user.stats.mean_score);
      }

      await series.save();
      await user.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  addReview: async ({ seriesId, userId, review, spoilerFree }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const newReview = {
        user: userId,
        review,
        created_at: date,
        updated_at: date,
      };
      const isExisted: any = await Series.findOne({
        _id: seriesId,
        "reviews.user": userId,
      });
      console.log(isExisted);
      if (isExisted) throw new Error("This user has already reviewed");
      const reviews: any = await Series.findByIdAndUpdate(
        seriesId,
        {
          $push: {
            reviews: {
              review,
              user: userId,
              spoiler_free: spoilerFree,
            },
          },
        },
        { returnDocument: "after" }
      );

      if (!reviews) throw new Error("Can't add review for this series");

      const id: any = reviews.reviews[reviews.reviews.length - 1]?._id;
      return {
        _id: id,
        ...newReview,
        user: findUserById(userId),
      };
    } catch (error) {
      throw error;
    }
  },
  deleteReview: async ({ seriesId, reviewId }: any) => {
    try {
      const reviews: any = await Series.findByIdAndUpdate(seriesId, {
        $pull: {
          reviews: {
            _id: reviewId,
          },
        },
      });
      if (!reviews) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  editReview: async ({ seriesId, reviewId, review, spoilerFree }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const reviews: any = await Series.findOneAndUpdate(
        {
          _id: seriesId,
          "reviews._id": reviewId,
        },
        {
          $set: {
            "reviews.$.review": review,
            "reviews.$.updated_at": date,
            "reviews.$.spoiler_free": spoilerFree,
          },
        }
      );
      console.log(reviews.reviews);
      if (!reviews) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
