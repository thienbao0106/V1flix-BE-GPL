const authDataType: String = `
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
`;

export default authDataType;
