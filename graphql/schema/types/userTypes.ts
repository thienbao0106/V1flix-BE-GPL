const userType: String = `

    type UserList {
        series: Series!
        status: String!
        currentEp: Int!
        note: String
    }

    type UserStats {
        days_watched: Float
        total_episodes: Int
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        list: [UserList]!
        favoriteList: [Series]
        avatar: String
        stats: UserStats
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
