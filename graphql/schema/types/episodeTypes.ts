const episodeType: String = `

    type Subtitle {
        lang: String!
        source: [Sources!]
        label: String!

    }
  

    type Episode {
        _id: ID!
        title: String!
        epNum: Int!
        source: [Sources!]
        view: Int!
        series: Series
        updated_at: Float!
        created_at: Float!
        subtitles: [Subtitle]
        keyframe: [Sources!]
        description: String!
        thumbnail: String!
    }
`;

const episodeInput: String = `
    input EpisodeInput {
        title: String!
        epNum: Int!
        seriesId: String
    }
`;

const episodeUpdateInput: String = `
    input EpisodeUpdateInput {
        title: String
        epNum: Int
        keyframe: String
        description: String
        thumbnail: String
    }
`;

const subtitleInput: String = `
    input SubtitleInput {
        lang: String!
        label: String!
    }
`;

export default `${episodeType}${episodeInput}${episodeUpdateInput}${subtitleInput}`;
