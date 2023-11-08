import User from "./userTypes";
import Image from "./imageTypes";
import AuthData from "./authDataTypes";
import Series from "./seríesTypes";
import Genres from "./genresTypes";
import Root from "./rootTypes";
import Episode from "./episodeTypes";
import Source from "./sourceTypes";

export const types = `
    ${User}
    ${Image}
    ${AuthData}
    ${Series}
    ${Genres}
    ${Episode}
    ${Source}
    ${Root}
`;
