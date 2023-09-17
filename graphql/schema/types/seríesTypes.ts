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
    }
`;

export default `${seriesType}${seriesInput}${seriesUpdateInput}`;
