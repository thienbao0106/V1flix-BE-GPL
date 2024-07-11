import Episode from "../../../models/episode";
import Series from "../../../models/series";
import { uploadEpisodeThumbToCloudinary } from "../../utils/image";
import { getKitsuThumbnails } from "../../utils/kitsu";
import { crunchyrollScrap } from "../../utils/scrapData";

export const thumbnails = {
  fillThumbnailsByCrunchy: async ({ url, seriesId, clickCount }: any) => {
    try {
      const series: any = await Series.findById(seriesId);
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      if (!episodes) throw Error("Can't find this series");
      const results: any = await crunchyrollScrap(
        url,
        episodes.length,
        clickCount
      );

      const thumbnails = await Promise.all(
        results.map(async (item: any) => {
          console.log(item);
          const url = await uploadEpisodeThumbToCloudinary(
            item.thumb,
            series.title.main_title.toLowerCase().replaceAll(" ", "_"),
            item.epNum
          );
          return {
            epNum: item.epNum,
            thumb: url,
          };
        })
      );

      thumbnails.map(async (thumb: any) => {
        const ep = await Episode.findOneAndUpdate(
          {
            series: seriesId,
            epNum: thumb.epNum,
          },
          {
            $set: {
              thumbnail: thumb.thumb,
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
  fillThumbnailsByKitsu: async ({ kitsuId, seriesId }: any) => {
    try {
      const episodes: any = await Episode.find({
        series: seriesId,
      });
      const series: any = await Series.findById(seriesId);
      const seriesTitle = series.title.main_title
        .toLowerCase()
        .replaceAll(" ", "_");
      if (!episodes) throw Error("Can't find this series");
      const thumbnails = await getKitsuThumbnails(
        kitsuId,
        episodes.length,
        seriesTitle
      );
      console.log("thumbnails------------");
      console.log(thumbnails);
      thumbnails.map(async (thumb: any) => {
        if (!thumb) return true;
        const ep = await Episode.findOneAndUpdate(
          {
            epNum: thumb.epNum,
            series: seriesId,
          },
          {
            $set: {
              thumbnail: thumb.thumbnail,
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
