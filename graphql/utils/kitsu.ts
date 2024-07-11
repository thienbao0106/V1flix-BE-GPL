import axios from "axios";
import { uploadEpisodeThumbToCloudinary } from "./image";

export const getKitsuDescriptions = async (
  kitsuId: string,
  totalEpisodes: number
) => {
  try {
    const result = await axios.get(
      `https://kitsu.io/api/edge/anime/${kitsuId}/episodes`
    );
    if (!result) throw Error("Can't get episodes of this series");
    const listEps = result.data.data.slice(0, totalEpisodes);
    return listEps.map((ep: any) => {
      return {
        epNum: ep.attributes.number,
        description: ep.attributes.description,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getKitsuThumbnails = async (
  kitsuId: string,
  totalEpisodes: number,
  seriesTitle: string
) => {
  try {
    const result = await axios.get(
      `https://kitsu.io/api/edge/anime/${kitsuId}/episodes`
    );
    if (!result) throw Error("Can't get episodes of this series");
    const kitsuEpisodesArray = result.data.data;

    //In case movie doesn't have thumbnail
    if (kitsuEpisodesArray.length === 1) {
      const result = await axios.get(
        `https://kitsu.io/api/edge/anime/${kitsuId}`
      );
      const thumbnailUrl = result.data.data.attributes;
      const url = await uploadEpisodeThumbToCloudinary(
        thumbnailUrl.posterImage.small,
        seriesTitle,
        1
      );

      return [
        {
          epNum: 1,
          thumbnail: url,
        },
      ];
    }

    //Otherwise
    const listEps = kitsuEpisodesArray.slice(0, totalEpisodes);

    return Promise.all(
      listEps.map(async (ep: any) => {
        if (ep.attributes.thumbnail) {
          const url = await uploadEpisodeThumbToCloudinary(
            ep.attributes.thumbnail.original,
            seriesTitle,
            ep.attributes.number
          );

          return {
            epNum: ep.attributes.number,
            thumbnail: url,
          };
        }
      })
    );
  } catch (error) {
    throw error;
  }
};
