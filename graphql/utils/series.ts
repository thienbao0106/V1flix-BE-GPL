import Series from "../../models/series";
import { findEpisodes } from "./episode";
import { findGenres } from "./genres";
import { findImages } from "./image";
import { findTags } from "./tags";
import { findUserById, transformUsers } from "./user";

export const transformSeries = (series: any, isRelation?: any) => {
  const seriesInfo = series._doc || series;
  let relation = [];

  if (isRelation && series.relation.length > 0) {
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
    rating: seriesInfo.rating.map(async (rate: any) => {
      return {
        score: rate.score,
        user: await findUserById(rate.user),
      };
    }),
    avg_score: formatRating(seriesInfo.rating),
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

export const formatRating = (rating: any): number => {
  if (rating.length === 0) return 0;
  const initialValue = 0;
  const listScore = rating.map((item: any) => item.score);
  const totalScore: number = listScore.reduce(
    (accumulator: any, currentValue: any) => accumulator + currentValue,
    initialValue
  );
  return parseFloat((totalScore / rating.length).toFixed(2));
};

export const getYoutubeId = (url: string): string => {
  // Create a URL object with the YouTube URL
  const parsedUrl = new URL(url);

  // Get the search params object from the URL object
  const searchParams = parsedUrl.searchParams;

  // Get the value of the 'v' parameter
  const videoId = searchParams.get("v");
  if (!videoId) return "";
  return videoId;
};
