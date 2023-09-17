import Genres from "../../models/genres";
import Image from "../../models/image";
import Series from "../../models/series";
import User from "../../models/user";
import { checkObject, paginateResult } from "../utils";
import { findEpisodes } from "../utils/episode";
import { findGenres } from "../utils/genres";
import { findImages } from "../utils/image";

const transformSeries = (series: any) => {
  return {
    ...series._doc,
    _id: series.id,
    images: findImages.bind(this, series.images),
    genres: findGenres.bind(this, series.genres),
    episodes: findEpisodes.bind(this, series.episodes),
  };
};

export const seriesResolvers = {
  series: async ({ pageNumber, limitPerPage }: any) => {
    try {
      const { result, totalPage } = await paginateResult(
        Series,
        pageNumber,
        limitPerPage
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
  createSeries: async (args: any, req: any) => {
    try {
      // if (!req.isAuth) throw new Error("Unauthenticated");
      const { title, description, total_episodes, type, season, status } =
        args.seriesInput;
      const series = new Series({
        title,
        description,
        total_episodes,
        type,
        season,
        status,
        view: 0,
      });
      const result: any = await series.save();
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  updateSeries: async ({ seriesInput, seriesId }: any) => {
    checkObject(seriesInput, "series");
    try {
      const result = await Series.findByIdAndUpdate(seriesId, seriesInput, {
        returnDocument: "after",
      });
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
      const genres: any = await Genres.find({ series: seriesId });
      console.log(genres);
      if (genres.length > 0) {
        genres.map((gen: any) => {
          console.log("test");
          gen.series = [...gen.series].filter((id: String) => id === seriesId);
          gen.save();
        });
      }
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
  addView: async ({ seriesId }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      console.log(series.view);
      series.view += 1;
      series.save();
      return series._doc.view;
    } catch (error) {
      throw error;
    }
  },
};
