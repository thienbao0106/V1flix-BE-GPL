import Series from "../../models/series";
import { findEpisodes } from "./episode";
import { findGenres } from "./genres";
import { findImages } from "./image";
import { findTags } from "./tags";

export const transformSeries = (series: any) => {
  const seriesInfo = series._doc || series;
  let relation: any = [];
  if (series.relation.length > 0) {
    relation = seriesInfo.relation.map((item: any) => {
      return {
        ...item._doc,
        related_series: findSeries(item._doc.related_series),
      };
    });
  }

  return {
    ...seriesInfo,
    _id: seriesInfo.id || seriesInfo._id,
    images: findImages.bind(this, seriesInfo.images),
    genres: findGenres.bind(this, seriesInfo.genres),
    tags: findTags.bind(this, seriesInfo.tags),
    episodes: findEpisodes.bind(this, seriesInfo.episodes),
    relation,
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
      return transformSeries(series);
    });
  } catch (err: any) {
    throw err;
  }
};
