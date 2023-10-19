const episodeType: String = `

    type Subtitle {
        lang: String!
        source: String!
    }
    input SubtitleInput {
        lang: String!
        source: String!
    }

    type Episode {
        _id: ID!
        title: String!
        epNum: Int!
        source: String!
        view: Int!
        series: Series
        updated_at: Float!
        created_at: Float!
        subtitles: [Subtitle]
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
        lang: String
        subtitles: [SubtitleInput]
    }
`;

export default `${episodeType}${episodeInput}${episodeUpdateInput}`;
