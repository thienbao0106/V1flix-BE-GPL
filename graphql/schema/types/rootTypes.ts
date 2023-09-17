const rootQueryType: String = `
    type SeriesPagination {
        series: [Series!]
        currentPage: Int!
        totalPage: Int!
    }

    type RootQuery {
        series(pageNumber: Int, limitPerPage: Int): SeriesPagination
        images: [Image!] 
        users: [User!]
        genres: [Genres!]
        episodes: [Episode!]
        login(email: String!, password: String!): AuthData! 
    }
`;

const rootMutationType: String = `
    type RootMutation {
        createSeries(seriesInput: SeriesInput!): Series
        deleteSeries(seriesId: String!): Boolean
        updateSeries(seriesInput: SeriesUpdateInput!, seriesId: String!): Series
        addView(seriesId: String!): Int


        createImage(imageInput: ImageInput!): Image
        deleteImage(imageId: String!): Boolean
        updateImage(imageInput: ImageUpdateInput!, imageId: String!): Image

        createUser(userInput: UserInput!): User
        addSeriesToList(userListInput: UserListInput!, userId: String!): User
        removeSeriesFromList(seriesId: String!, userId: String!): Boolean
        removeUser(userId: String!): Boolean

        createGenres(genresInput: GenresInput!): Genres
        addSeriesToGenres(seriesArr: [String]!, genresId: String!): Genres
        deleteGenres(genresId: String!): Boolean
        updateGenres(genresInput: GenresUpdateInput!, genresId: String!): Genres 

        createEpisode(episodeInput: EpisodeInput!): Episode
        updateEpisode(episodeInput: EpisodeUpdateInput!, episodeId: String!): Episode
        deleteEpisode(episodeId: String!): Boolean
    }
`;

export default `${rootQueryType}${rootMutationType}`;
