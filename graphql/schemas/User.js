module.exports = `
type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    addedFood: [Food!]
}

input UserInputData {
    name: String!
    password: String!
    email: String!
}

type Mutation {
    createUser(userInput: UserInputData): User!
}
`;
