const genresType: String = `
    type Genres {
        _id: ID!
        name: String!
        series: [Series]
      }
`;

const genresInput: String = `
    input GenresInput {
        name: String!
    }
`;

const genresUpdateInput: String = `
    input GenresUpdateInput {
        name: String
    }
`;

export default `${genresType}${genresInput}${genresUpdateInput}`;
