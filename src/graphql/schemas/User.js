module.exports = `
type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    addedFood: [Food!]
}

input createUserInputData {
    name: String!
    password: String!
    email: String!
}

input loginUserInputData {
    password: String!
    email: String!
}

type Mutation {
    createUser(userInput: createUserInputData): User!
    loginUser(userInput: loginUserInputData): String!
}
`;
