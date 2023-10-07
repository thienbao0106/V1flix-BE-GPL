const episodeType: String = `
    type Episode {
        _id: ID!
        title: String!
        epNum: Int!
        source: String!
        view: Int!
        series: Series
        updated_at: Float!
        created_at: Float!
      }
`;

const episodeInput: String = `
    input EpisodeInput {
        title: String!
        epNum: Int!
        source: String!
        seriesId: String
    }
`;

const episodeUpdateInput: String = `
    input EpisodeUpdateInput {
        title: String
        epNum: Int
        source: String
    }
`;

export default `${episodeType}${episodeInput}${episodeUpdateInput}`;
