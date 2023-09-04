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

      type RootQuery {
        series: [Series!]
        images: [Image!] 
      }

      type RootMutation {
        createSeries(seriesInput: SeriesInput): Series
        createImage(imageInput: ImageInput): Image
      }

      schema {
        query: RootQuery 
        mutation: RootMutation
      }
`);
