const userSchema = `
type User {
    _id: ID!
    name: String!
    email: String!
    password: String
}

type UserQueryResponse {
    _id: ID!
    name: String!
    email: String!
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
    addFriend(id: String): String!
}

type Query {
    getUser(name: String): [UserQueryResponse]
}
`;

export default userSchema;
