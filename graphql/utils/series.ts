import Series from "../../models/series";
import { findEpisodes } from "./episode";
import { findGenres } from "./genres";
import { findImages } from "./image";

export const findSeries = async (seriesId: string): Promise<any> => {
  try {
    console.log("-------");
    console.log(seriesId);
    const result: any = await Series.findById(seriesId);
    return {
      ...result._doc,
      _id: result.id,
      images: findImages.bind(this, result.images),
      genres: findGenres.bind(this, result.genres),
      episodes: findEpisodes.bind(this, result.episodes),
    };
  } catch (err: any) {
    throw err;
  }
};

export const findMultipleSeries = async (seriesIds: any): Promise<any> => {
  try {
    const result: any = await Series.find({ _id: { $in: seriesIds } });
    return result.map((series: any) => {
      return {
        ...series._doc,
        _id: series.id,
        images: findImages.bind(this, series.images),
        genres: findGenres.bind(this, series.genres),
        episodes: findEpisodes.bind(this, result.episodes),
      };
    });
  } catch (err: any) {
    throw err;
  }
};
