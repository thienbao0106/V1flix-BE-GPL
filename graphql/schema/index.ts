import { buildSchema } from "graphql";
import { types } from "./types/index.js";
export const schema = buildSchema(`
      ${types}
      
      schema {
        query: RootQuery 
        mutation: RootMutation
      }
`);
