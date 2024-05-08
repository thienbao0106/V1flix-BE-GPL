import Episode from "../../../models/episode";
import { getKitsuDescriptions } from "../../utils/kitsu";
import { wikipediaScrap } from "../../utils/scrapData";

export const description = {
  fillDescriptionByKitsu: async ({ kitsuId, seriesId }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const descriptions = await getKitsuDescriptions(kitsuId, episodes.length);
      descriptions.map(async (des: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: des.epNum,
          },
          {
            $set: {
              description: des.description,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
  fillDescriptionByWiki: async ({ url, seriesId, skipElements }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const descriptions: any = await wikipediaScrap(
        url,
        episodes.length,
        skipElements
      );
      descriptions.map(async (des: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: des.epNum,
          },
          {
            $set: {
              description: des.description,
            },
          }
        );
        if (!ep) return true;
        return false;
      });
    } catch (error) {
      throw error;
    }
  },
};
