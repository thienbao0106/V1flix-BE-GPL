const tokenTypes = `
    type Token {
        _id: ID!
        kind: String!
        value: String!
        expiresAt: Float!
    }
`;

const inputTokenTypes = `
    input TokenInput {
        kind: String!
        value: String!
        expiresAt: Float!
    }
`;

export default `${tokenTypes}${inputTokenTypes}`;
