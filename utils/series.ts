import Series from "../models/series";
import { findGenres } from "./genres";
import { findImages } from "./images";

export const findSeries = async (seriesId: string): Promise<any> => {
  try {
    const result: any = await Series.findById(seriesId);
    return {
      ...result._doc,
      _id: result.id,
      images: findImages.bind(this, result.images),
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
      };
    });
  } catch (err: any) {
    throw err;
  }
};
