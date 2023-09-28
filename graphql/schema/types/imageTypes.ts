const imageType: String = `
    type Image {
        _id: ID!
        name: String!
        type: String!
        source: String!
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

const imageUpdateInput: String = `
    input ImageUpdateInput {
        name: String
        type: String
        source: String!
        seriesId: String
    }
`;

export default `${imageType}${imageInput}${imageUpdateInput}`;
