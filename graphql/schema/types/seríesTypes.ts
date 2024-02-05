const seriesType: String = ` 
    type Relation {
        role: String!
        related_series: Series!
    }
    
    type Title {
        main_title: String!
        alt_title: String!
    }

    type Trailer {
        id: String!
        site: String!
        thumbnail: String!
    }

    type Rating {
        user: User!
        score: Float!
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
        tags: [Tags!]!
        episodes: [Episode!]!
        updated_at: Float!
        created_at: Float!
        duration: Int!
        favors: Int!
        trailer: Trailer
        relation: [Relation]
        rating: [Rating]
        avg_score: Float
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

const relationInput: String = `
    input RelationUpdateInput {
        idSeries: String!
        idRelatedSeries: String!
        role: String!
    }
`;

export default `${seriesType}${seriesInput}${seriesUpdateInput}${relationInput}`;
