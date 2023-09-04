import Series from "../../models/series";
import Image from "../../models/image";
//manual population
const findSeries = async (seriesId: string): Promise<any> => {
  try {
    const result: any = await Series.findById(seriesId);
    return {
      ...result._doc,
      _id: result.id,
      images: findImages.bind(this, result.images),
    };
  } catch (err: any) {
    throw err;
  }
};

const findImages = async (imagesId: []): Promise<any> => {
  try {
    const result = await Image.find({ _id: { $in: imagesId } });
    return result.map((image: any) => {
      return {
        ...image._doc,
        _id: image.id,
        series: findSeries.bind(this, image.series),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const resolvers = {
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
  images: async () => {
    try {
      const result = await Image.find();
      return result.map((image: any) => {
        return {
          ...image._doc,
          _id: image.id,
          series: findSeries.bind(this, image.series),
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
      return { ...result._doc, _id: series.id };
    } catch (error) {
      throw error;
    }
  },
  createImage: async (args: any) => {
    try {
      const { type, name } = args.imageInput;
      const series = await Series.findById("64f54e423cb6066d3f893108");
      if (!series) throw new Error("Can't find the series");
      const image = new Image({
        name,
        type,
        series: "64f54e423cb6066d3f893108",
      });
      const result: any = await image.save();
      series.images.push(result._id);
      await series.save();
      return {
        ...result._doc,
        _id: result.id,
        series: findSeries.bind(this, result.series),
      };
    } catch (error) {
      throw error;
    }
  },
};
