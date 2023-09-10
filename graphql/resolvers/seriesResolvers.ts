import Image from "../../models/image";
import Series from "../../models/series";
import { checkObject } from "../utils";
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
      let result;
      if (!pageNumber || !limitPerPage) result = await Series.find();
      result = await Series.find()
        .limit(limitPerPage)
        .skip(limitPerPage * pageNumber);
      const totalPage = Math.ceil((await Series.count()) / limitPerPage);

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
      return true;
    } catch (error) {
      throw error;
    }
  },
};
