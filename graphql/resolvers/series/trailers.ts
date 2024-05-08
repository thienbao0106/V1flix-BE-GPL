import { getYoutubeId } from "../../utils/series";
import Series from "../../../models/series";

export const trailers = {
  //Only for Youtube trailer
  addTrailer: async ({ idSeries, trailerUrl }: any) => {
    try {
      const idTrailer = getYoutubeId(trailerUrl);
      const result = await Series.findByIdAndUpdate(idSeries, {
        $push: {
          trailer: {
            idTrailer,
            thumbnail: `https://i.ytimg.com/vi/${idTrailer}/hqdefault.jpg`,
            site: "youtube",
          },
        },
      });
      if (result) return true;
      return false;
    } catch (error) {
      throw error;
    }
  },
};
