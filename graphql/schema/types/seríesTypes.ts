const seriesType: String = ` 

    type Title {
        main_title: String!
        alt_title: String!
    }

    type Trailer {
        id: String!
        site: String!
        thumbnail: String!
    }

    type Series {
        _id: ID!
        title: Title
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
        favors: Int!
        trailer: Trailer
    }
`;

const seriesInput: String = ` 
    input SeriesInput {
        main_title: String!
        alt_title: String!
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
        main_title: String
        alt_title: String
        description: String
        total_episodes: Int
        type: String
        season: String
        status: String
        duration: Int
    }
`;

export default `${seriesType}${seriesInput}${seriesUpdateInput}`;
