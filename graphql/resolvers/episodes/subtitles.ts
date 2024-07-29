import Episode from "../../../models/episode";
import Series from "../../../models/series";

export const subtitles = {
  addSubtitle: async ({ subtitleInput, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return;
      const isExisted = episode.subtitles.find(
        (sub: any) => sub.lang === subtitleInput.lang
      );
      if (isExisted) return false;

      episode.subtitles.push(subtitleInput);
      episode.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  addMultipleSubtitle: async ({ seriesId, lang, label }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      series.episodes.map(async (ep: any) => {
        const episode: any = await Episode.findById(ep);
        episode.subtitles.push({ lang, label });
        episode.save();
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSubtitle: async ({ lang, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return false;

      episode.subtitles = [...episode.subtitles].filter(
        (sub: any) => sub.lang !== lang
      );
      console.log(episode.subtitles);
      episode.save();
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateSubtitle: async ({ subtitleInput, episodeId }: any) => {
    try {
      const episode: any = await Episode.findById(episodeId);
      if (!episode) return;
      episode.subtitles = [...episode.subtitles].filter(
        (sub: any) => sub.lang !== subtitleInput.lang
      );

      episode.subtitles.push(subtitleInput);
      episode.save();
      return episode;
    } catch (error) {
      throw error;
    }
  },
};
