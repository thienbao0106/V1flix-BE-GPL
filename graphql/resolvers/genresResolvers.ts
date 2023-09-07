import Genres from "../../models/genres";
import { findMultipleSeries, findSeries } from "../../utils/series";

export const genresResolvers = {
  genres: async () => {
    try {
      const result = await Genres.find();
      return result.map((genres: any) => {
        return {
          ...genres._doc,
          _id: genres.id,
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createGenres: async (args: any) => {
    try {
      const { name, description } = args.genresInput;
      const isExisted = await Genres.find({ name: name.toLowerCase() });
      console.log(isExisted);
      if (isExisted) throw new Error("This genres is already existed");
      const genres = new Genres({
        name: name.toLowerCase(),
        description,
      });
      const result: any = await genres.save();
      return {
        ...result._doc,
        _id: result.id,
      };
    } catch (error) {
      throw error;
    }
  },
  addSeriesToGenres: async (args: any) => {
    try {
      const { seriesArr, idGenres } = args;
      console.log(idGenres);

      const result: any = await Genres.findByIdAndUpdate(
        idGenres,
        { series: seriesArr },
        { returnDocument: "after" }
      );
      return {
        ...result._doc,
        series: await findMultipleSeries(result._doc.series),
      };
    } catch (error) {
      throw error;
    }
  },
};
