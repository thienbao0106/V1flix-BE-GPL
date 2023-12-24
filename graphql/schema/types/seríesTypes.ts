const seriesType: String = ` 
    type Series {
        _id: ID!
        title: String!
        description: String!
        total_episodes: Int!
        type: String!
        season: String!
        status: String!
        view: Int!
        images: [Image!]!
        genres: [Genres!]!
        episodes: [Episode!]!
        updated_at: Float!
        created_at: Float!
        duration: Int!
    }
`;

const seriesInput: String = ` 
    input SeriesInput {
        title: String!
        description: String!
        total_episodes: Int!
        type: String!
        season: String!
        status: String!
        duration: Int!
    }
`;

const seriesUpdateInput: String = ` 
    input SeriesUpdateInput {
        title: String
        description: String
        total_episodes: Int
        type: String
        season: String
        status: String
        duration: Int!
    }
`;

export default `${seriesType}${seriesInput}${seriesUpdateInput}`;
