import Genres from "../../models/genres";
import Series from "../../models/series";
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
      if (isExisted.length > 0)
        throw new Error("This genres is already existed");
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
      const currentGenres: any = await Genres.findById(idGenres);
      const result: any = await Genres.updateOne(
        { _id: idGenres },
        { series: [...currentGenres.series, seriesArr] }
      );

      const listSeries = await findMultipleSeries([
        ...currentGenres.series,
        seriesArr,
      ]);
      listSeries.map(async (series: any) => {
        const listGenres = await series.genres();
        listGenres.push(idGenres);
        await Series.findByIdAndUpdate(series._id, {
          genres: listGenres,
        });
      });

      return {
        ...result._doc,
        series: listSeries,
      };
    } catch (error) {
      throw error;
    }
  },
  deleteGenres: async ({ genresId }: any) => {
    try {
      const result: any = await Genres.findByIdAndDelete(genresId);
      const listSeries = await findMultipleSeries(result._doc.series);
      listSeries.map(async (series: any) => {
        const listGenres: [] = (await series.genres()).filter(
          (genres: String) => genres === genresId
        );
        await Series.findByIdAndUpdate(series._id, {
          genres: listGenres,
        });
      });
      console.log(result);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateGenres: async ({ idGenres, genresInput }: any) => {
    try {
      const result: any = await Genres.findByIdAndUpdate(
        idGenres,
        genresInput,
        {
          returnDocument: "after",
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
