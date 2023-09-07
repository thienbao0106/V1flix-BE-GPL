const seriesType: String = ` 
    type Series {
        _id: ID!
        title: String!
        description: String!
        total_episodes: Int!
        type: String!
        season: String!
        status: String!
        images: [Image!]!
        genres: [Genres!]!

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

export default `${seriesType}${seriesInput}`;
