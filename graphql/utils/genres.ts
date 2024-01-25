import Genres from "../../models/genres.js";
import { findMultipleSeries, findSeries } from "./series.js";

export const transformGenres = (genres: any) => {
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

export const getGenresId = async (genresArr: any) => {
  if (!genresArr || genresArr.length === 0) return [];
  const result = await Genres.find({ name: { $in: genresArr } });
  return result.map((item) => item._id);
};

export const addSeriesToGenres = (genresArr: any, seriesId: string) => {
  try {
    genresArr.map(async (genresId: any) => {
      const genre = await Genres.findByIdAndUpdate(
        genresId,
        { $addToSet: { series: seriesId } },
        { new: true }
      );
      if (!genre) throw Error("Can't add this tag" + genresId);
      return;
    });
  } catch (error) {
    throw error;
  }
};
