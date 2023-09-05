import Image from "../models/image";
import { findSeries } from "./series";

export const findImages = async (imagesId: []): Promise<any> => {
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
