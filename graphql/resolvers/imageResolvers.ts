import Image from "../../models/image";
import Series from "../../models/series";
import { checkObject } from "../utils";
import { transformImage } from "../utils/image";

const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageResolvers = {
  images: async () => {
    try {
      const result = await Image.find();

      return result.map((image: any) => {
        return transformImage(image);
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
        source: cloudinary.url(`anime-v2/${type}/${name}`),
      });
      const result: any = await image.save();
      series.images.push(result._id);
      series.save();
      return transformImage(result);
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
      series.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateImage: async ({ imageInput, imageId }: any) => {
    try {
      checkObject(imageInput, "image");
      const result: any = await Image.findByIdAndUpdate(
        imageId,
        { ...imageInput, series: imageInput.seriesId || "" },
        {
          returnDocument: "after",
        }
      );
      if (imageInput.seriesId) {
        const series: any = await Series.findById(imageInput.seriesId);
        if (series._doc.images.indexOf(imageId) <= 0) {
          series._doc.images = [...series._doc.images, result.id];
          series.markModified("images");
          series.save();
        }
      }
      return transformImage(result);
    } catch (error) {
      throw error;
    }
  },
};
