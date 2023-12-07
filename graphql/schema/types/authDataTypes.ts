const authDataType: String = `
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        username: String!
    }
`;

export default authDataType;
