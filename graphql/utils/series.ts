import Series from "../../models/series";
import { findEpisodes } from "./episode";
import { findGenres } from "./genres";
import { findImages } from "./image";

export const transformSeries = (series: any) => {
  const seriesInfo = series._doc || series;
  console.log(seriesInfo);
  return {
    ...seriesInfo,
    _id: seriesInfo.id || seriesInfo._id,
    images: findImages.bind(this, seriesInfo.images),
    genres: findGenres.bind(this, seriesInfo.genres),
    episodes: findEpisodes.bind(this, seriesInfo.episodes),
  };
};

export const findSeries = async (seriesId: string): Promise<any> => {
  try {
    const result: any = await Series.findById(seriesId);
    return transformSeries(result._doc);
  } catch (err: any) {
    throw err;
  }
};

export const findMultipleSeries = async (seriesIds: any): Promise<any> => {
  try {
    const result: any = await Series.find({ _id: { $in: seriesIds } });
    return result.map((series: any) => {
      return transformSeries(result._doc);
    });
  } catch (err: any) {
    throw err;
  }
};
