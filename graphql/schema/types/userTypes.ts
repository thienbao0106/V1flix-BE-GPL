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
    }
`;

const userInput: String = `
    input UserInput {
        username: String!
        email: String!
        password: String!
    }
    input UserListInput {
        seriesId: String!
        status: String!
        currentEp: Int!
        note: String!
    }
`;

export default `${userType}${userInput}`;
