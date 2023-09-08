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
        login(email: String, password: String): AuthData! 
    }
`;

const rootMutationType: String = `
    type RootMutation {
        createSeries(seriesInput: SeriesInput): Series

        createImage(imageInput: ImageInput): Image
        deleteImage(imageId: String): Boolean
        updateImage(imageInput: GenresInput, imageId: String!): Image

        createUser(userInput: UserInput): User

        createGenres(genresInput: GenresInput): Genres
        addSeriesToGenres(seriesArr: [String], idGenres: String!): Genres
        deleteGenres(genresId: String): Boolean
        updateGenres(genresInput: GenresInput, idGenres: String!): Genres
    }
`;

export default `${rootQueryType}${rootMutationType}`;
