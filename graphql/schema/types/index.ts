import User from "./userTypes";
import Image from "./imageTypes";
import AuthData from "./authDataTypes";
import Series from "./seríesTypes";
import Genres from "./genresTypes";

export const types = `
    ${User}
    ${Image}
    ${AuthData}
    ${Series}
    ${Genres}

    type RootQuery {
        series: [Series!]
        images: [Image!] 
        users: [User!]
        genres: [Genres!]
        login(email: String, password: String): AuthData! 
    }

    type RootMutation {
        createSeries(seriesInput: SeriesInput): Series
        createImage(imageInput: ImageInput): Image
        createUser(userInput: UserInput): User
        createGenres(genresInput: GenresInput): Genres
        addSeriesToGenres(seriesArr: [String], idGenres: String): Genres
    }
`;
