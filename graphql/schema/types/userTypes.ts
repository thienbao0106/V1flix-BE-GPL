const userType: String = `

    type UserList {
        series: Series!
        status: String!
        currentEp: Int!
        note: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        list: [UserList]!
        avatar: String
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
