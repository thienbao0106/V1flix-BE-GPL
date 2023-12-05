const rootQueryType: String = `
    type SeriesPagination {
        series: [Series!]
        currentPage: Int!
        totalPage: Int!
    }

    type EpisodesPagination {
        episodes: [Episode!]
        currentPage: Int!
        totalPage: Int!
    }

    type RootQuery {
        series(pageNumber: Int, limitPerPage: Int, amount: Int): SeriesPagination
        images: [Image!] 
        users: [User!]
        genres: [Genres!]
        episodes(pageNumber: Int, limitPerPage: Int, amount: Int): EpisodesPagination
        login(email: String!, password: String!): AuthData! 
        findSeries(title: String!, numOfLimit: Int!, genresId: String, status: String ): [Series!]
        randomSeries: Series
        searchEpisode(seriesId: String!, epNum: Int!): Episode
        sources: [Sources!]
        token: [Token!]
        findToken(kind: String!): Token
        findEpisode(episodeId: String!): Episode
    }
`;

const rootMutationType: String = `
    type RootMutation {
        createSeries(seriesInput: SeriesInput!): Series
        deleteSeries(seriesId: String!): Boolean
        updateSeries(seriesInput: SeriesUpdateInput!, seriesId: String!): Series
        addView(seriesId: String!, episodeId: String!): Int

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
        addSubtitle(subtitleInput: SubtitleInput!, episodeId: String!): Boolean
        deleteSubtitle(lang: String!, episodeId: String!): Boolean
        updateSubtitle(subtitleInput: SubtitleInput!, episodeId: String!): Episode
        
        createSource(sourceInput: SourceInput!,  episodeId: String!, type: String!, lang: String): Sources
        addSourceToEpisode(sourceId: String!, episodeId: String!, type: String!, lang: String): Boolean
        deleteSource(sourceId: String!, episodeId: String!, type: String!): Boolean
        editSource(sourceInput: SourceInput!, sourceId: String!): Sources

        createToken(tokenInput: TokenInput!): Token
        editToken(value: String!, expiresAt: Float!, tokenId: String!): Token
        deleteToken(tokenId: String!): Boolean
    }
`;

export default `${rootQueryType}${rootMutationType}`;
