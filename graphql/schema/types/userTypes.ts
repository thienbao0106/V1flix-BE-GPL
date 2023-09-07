const userType: String = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
    }
`;

const userInput: String = `
    input UserInput {
        username: String!
        email: String!
        password: String!
    }
`;

export default `${userType}${userInput}`;
