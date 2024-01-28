import axios from "axios";

export const getDescriptions = async (
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
