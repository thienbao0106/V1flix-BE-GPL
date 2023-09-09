import Genres from "../../models/genres";
import { findSeries } from "./series";

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
