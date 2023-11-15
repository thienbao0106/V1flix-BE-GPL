import Genres from "../../models/genres";
import { findMultipleSeries, findSeries } from "./series";

export const transformGenres = (genres: any) => {
  console.log(genres.series);
  return {
    ...genres._doc,
    _id: genres.id,
    series: findMultipleSeries.bind(this, genres.series),
  };
};

export const findGenres = async (genresId: []): Promise<any> => {
  try {
    const result = await Genres.find({ _id: { $in: genresId } });
    return result.map((genres: any) => {
      return {
        ...genres._doc,
        _id: genres.id,
        series: findSeries.bind(this, genres.series),
      };
    });
  } catch (error) {
    throw error;
  }
};
