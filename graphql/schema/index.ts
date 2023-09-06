import { buildSchema } from "graphql";

export const schema = buildSchema(`
      type Series {
        _id: ID!
        title: String!
        description: String!
        total_episodes: Int!
        type: String!
        season: String!
        status: String!
        images: [Image!]!
      }

      type Image {
        _id: ID!
        name: String!
        type: String!
        series: Series!
      }

      type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
      }

      type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
      }

      input SeriesInput {
        title: String!
        description: String!
        total_episodes: Int!
        type: String!
        season: String!
        status: String!
      }

      input ImageInput {
        name: String!
        type: String!
      }

      input UserInput {
        username: String!
        email: String!
        password: String!
      }

      type RootQuery {
        series: [Series!]
        images: [Image!] 
        users: [User!]
        login(email: String, password: String): AuthData! 
      }

      type RootMutation {
        createSeries(seriesInput: SeriesInput): Series
        createImage(imageInput: ImageInput): Image
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery 
        mutation: RootMutation
      }
`);
