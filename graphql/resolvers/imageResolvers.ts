import Image from "../../models/image";
import Series from "../../models/series";
import { findSeries } from "../../utils/series";

export const imageResolvers = {
  images: async () => {
    try {
      const result = await Image.find();
      return result.map((image: any) => {
        return image;
      });
    } catch (error) {
      throw error;
    }
  },

  createImage: async (args: any) => {
    try {
      const { type, name, seriesId } = args.imageInput;
      const series = await Series.findById(seriesId);
      if (!series) throw new Error("Can't find the series");
      const image = new Image({
        name,
        type,
        series: seriesId,
      });
      const result: any = await image.save();
      series.images.push(result._id);
      await series.save();
      return image;
    } catch (error) {
      throw error;
    }
  },

  deleteImage: async ({ imageId }: any) => {
    try {
      const result: any = await Image.findByIdAndDelete(imageId);
      const series: any = await Series.findById(result.series.toString());
      console.log(series);

      series._doc.images = [...series._doc.images].filter(
        (image: String) => image === imageId
      );
      await series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateImage: async ({ imageInput, imageId }: any) => {
    try {
      const result: any = await Image.findByIdAndUpdate(imageId, imageInput, {
        returnDocument: "after",
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
};
