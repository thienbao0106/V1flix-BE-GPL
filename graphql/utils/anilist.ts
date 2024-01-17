import axios from "axios";

export const getALShow = async (id: number) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = `
        query getShow($id: Int) {
            Media(id: $id) {
                title {
                    romaji
                    english
                  }
                description
                season
                seasonYear
                format
                episodes
                status
                duration
                trailer {
                  id
                  site
                  thumbnail
                }
            }
        }
    `;

    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    if (!result.data.data) throw new Error("Can't find this series");
    console.log(result.data.data);
    return result.data.data;
  } catch (error) {
    throw error;
  }
};
