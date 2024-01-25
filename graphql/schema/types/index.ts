import User from "./userTypes.js";
import Image from "./imageTypes.js";
import AuthData from "./authDataTypes.js";
import Series from "./seríesTypes.js";
import Genres from "./genresTypes.js";
import Root from "./rootTypes.js";
import Episode from "./episodeTypes.js";
import Source from "./sourceTypes.js";
import Token from "./tokenTypes.js";
import Tag from "./tagTypes.js";

export const types = `
    ${User}
    ${Image}
    ${AuthData}
    ${Series}
    ${Genres}
    ${Episode}
    ${Source}
    ${Root}
    ${Token}
    ${Tag}
`;
