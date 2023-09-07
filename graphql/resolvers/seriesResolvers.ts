import Series from "../../models/series";
import { findImages } from "../../utils/images";

export const seriesResolvers = {
  series: async () => {
    try {
      const result = await Series.find();
      return result.map((series: any) => {
        return {
          ...series._doc,
          _id: series.id,
          images: findImages.bind(this, series.images),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createSeries: async (args: any) => {
    try {
      const { title, description, total_episodes, type, season, status } =
        args.seriesInput;
      const series = new Series({
        title,
        description,
        total_episodes,
        type,
        season,
        status,
      });
      const result: any = await series.save();
      return {
        ...result._doc,
        _id: series.id,
        images: findImages.bind(this, result.images),
      };
    } catch (error) {
      throw error;
    }
  },
};
