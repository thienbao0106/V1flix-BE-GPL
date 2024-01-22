const tagsType: String = `
    type Tags {
        _id: ID!
        name: String!
        description: String
        series: [Series]
      }
`;

const tagsInput: String = `
    input tagsInput {
        name: String!
        description: String!
    }
`;

const tagsUpdateInput: String = `
    input tagsUpdateInput {
        name: String
        description: String
    }
`;

export default `${tagsType}${tagsInput}${tagsUpdateInput}`;
