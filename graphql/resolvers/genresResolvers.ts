import Genres from "../../models/genres.js";
import Series from "../../models/series.js";
import { checkObject } from "../utils/index.js";
import { findMultipleSeries } from "../utils/series.js";
import {
  addSeriesToGenres,
  getGenresId,
  transformGenres,
} from "../utils/genres.js";
import { getALGenres, getALGenresShow } from "../utils/anilist.js";

export const genresResolvers = {
  genres: async () => {
    try {
      const result = await Genres.find();
      console.log(result);
      return result.map((genres: any) => {
        return transformGenres(genres);
      });
    } catch (error) {
      throw error;
    }
  },
  findGenresById: async ({ genreId }: any) => {
    try {
      const result = await Genres.findById(genreId);
      if (!result) throw new Error("Can't find this genre");
      return transformGenres(result);
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
      return transformGenres(result);
    } catch (error) {
      throw error;
    }
  },
  addSeriesToGenres: async (args: any) => {
    try {
      const { seriesArr, genresId } = args;
      const currentGenres: any = await Genres.findById(genresId);
      const result: any = await Genres.findByIdAndUpdate(
        genresId,
        { series: [...currentGenres.series, seriesArr] },
        { returnDocument: "after" }
      );

      const listSeries = await findMultipleSeries([
        ...currentGenres.series,
        seriesArr,
      ]);
      listSeries.map(async (series: any) => {
        const listGenres = await series.genres();
        listGenres.push(genresId);
        await Series.findByIdAndUpdate(series._id, {
          genres: listGenres,
        });
      });

      return transformGenres(result);
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
  updateGenres: async ({ genresId, genresInput }: any) => {
    try {
      checkObject(genresInput, "genres");
      const result: any = await Genres.findByIdAndUpdate(
        genresId,
        genresInput,
        {
          returnDocument: "after",
        }
      );
      console.log(result);
      return transformGenres(result);
    } catch (error) {
      throw error;
    }
  },
  addGenresByAnilist: async () => {
    try {
      const list = await getALGenres();
      console.log(list);
      if (!list) return false;
      const result = await Genres.insertMany(list, {
        ordered: true,
      });
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteAllGenres: async () => {
    try {
      const result = await Genres.deleteMany();
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
  fillGenres: async ({ seriesId, anilistId }: any) => {
    try {
      const genres = await getALGenresShow(anilistId);
      const genresIdArr = await getGenresId(genres);
      addSeriesToGenres(genresIdArr, seriesId);
      const result = await Series.findByIdAndUpdate(seriesId, {
        genres: genresIdArr,
      });
      if (!result) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
