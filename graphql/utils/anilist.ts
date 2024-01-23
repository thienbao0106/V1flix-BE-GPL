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
                tags {
                  name
                }
                genres
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

export const getALGenresShow = async (id: number) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = `
      query getGenresShow($id: Int) {
        Media(id: $id) {
           genres
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
    return result.data.data.Media.genres;
  } catch (error) {
    throw error;
  }
};

export const getALTagsShow = async (id: number) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = `
      query getGenresShow($id: Int) {
        Media(id: $id) {
           tags {
              name
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
    return result.data.data.Media.tags;
  } catch (error) {
    throw error;
  }
};

export const getALGenres = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = `
      query getGenres {
        GenreCollection
      }
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
    });
    console.log(result.data.data);
    if (!result.data.data) throw new Error("Can't handle tag");
    const genres = result.data.data.GenreCollection.filter(
      (genre: any) => genre !== "Hentai"
    ).map((name: string) => {
      return {
        name,
      };
    });
    return genres;
  } catch (error) {
    throw error;
  }
};

export const getALTags = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = `
        query getTags {
           MediaTagCollection {
            name
            description
            isAdult
          }
        }
    `;
    console.log("called");
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
    });
    console.log(result.data.data);
    if (!result.data.data) throw new Error("Can't handle tag");
    const tags = result.data.data.MediaTagCollection.filter(
      (tag: any) => !tag.isAdult
    );
    return tags;
  } catch (error) {
    throw error;
  }
};
