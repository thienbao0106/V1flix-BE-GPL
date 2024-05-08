import Series from "../../../models/series";
import Episode from "../../../models/episode";

export const views = {
  addView: async ({ seriesId, episodeId }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      console.log(series.view);
      const episode: any = await Episode.findById(episodeId);
      series.view += 1;
      episode.view += 1;
      series.save();
      episode.save();
      return series._doc.view;
    } catch (error) {
      throw error;
    }
  },
};
