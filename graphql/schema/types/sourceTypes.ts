const sourceTypes = `
    type Sources {
        _id: ID!
        kind: String!
        value: String!
        created_at: Float!
        updated_at: Float!
    }
`;

const inputSourceTypes = `
    input SourceInput {
        kind: String!
        value: String!
    }
`;

export default `${sourceTypes}${inputSourceTypes}`;
