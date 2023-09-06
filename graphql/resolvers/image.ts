import Image from "../../models/image";
import Series from "../../models/series";
import { findSeries } from "../../utils/series";

const transformImage = (image: any) => {
  return {
    ...image._doc,
    _id: image.id,
    series: findSeries.bind(this, image.series),
  };
};

export const imageResolvers = {
  images: async () => {
    try {
      const result = await Image.find();
      return result.map((image: any) => {
        transformImage(image);
      });
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
      transformImage(image);
    } catch (error) {
      throw error;
    }
  },
};
