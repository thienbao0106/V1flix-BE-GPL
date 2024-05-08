import { getALImages } from "./../../utils/anilist";
import Series from "../../../models/series";
import Image from "../../../models/image";

export const seriesImages = {
  fillImages: async ({ anilistId, seriesId }: any) => {
    try {
      const series: any = await Series.findById(seriesId);

      const title = series.title.main_title.toLowerCase().replaceAll(" ", "_");
      const images = await getALImages(anilistId, title, series._id);
      const result = await Image.insertMany(images);
      console.log("result-----");
      console.log(result);
      const resultIds = result.map((item: any) => item._id);
      series.images = resultIds;
      series.save();

      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSeriesImages: async ({ seriesId }: any) => {
    try {
      await Image.deleteMany({
        series: seriesId,
      });
      const series = await Series.findByIdAndUpdate(seriesId, {
        images: [],
      });
      if (!series) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },
};
