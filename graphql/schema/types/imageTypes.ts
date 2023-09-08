const imageType: String = `
    type Image {
        _id: ID!
        name: String!
        type: String!
        series: Series!
      }
`;

const imageInput: String = `
    input ImageInput {
        name: String!
        type: String!
        seriesId: String
    }
`;

export default `${imageType}${imageInput}`;
