import { buildSchema } from "graphql";
import { types } from "./types/index";
export const schema = buildSchema(`
      ${types}
      
      schema {
        query: RootQuery 
        mutation: RootMutation
      }
`);
