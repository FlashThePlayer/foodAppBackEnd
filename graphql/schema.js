const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        addedFood: [Food!]
    }

    type Food {
        _id: ID!
        name: String!
        link: String!
        favorite: Boolean!
        rating: Int!
        difficulty: String!
        creator: User!
        keywords: [String!]
        createdAt: String!
        updatedAt: String!
    }

    input UserInputData {
        name: String!
        password: String!
        email: String!
    }

    input FoodInputData {
        name: String!
        link: String!
        favorite: Boolean!
        rating: Int!
        difficulty: String!
        keywords: [String!]
    }


    type RootMutation {
        createUser(userInput: UserInputData): User!
        createFood(foodInput: FoodInputData): Food!
    } 

    type RootQuery {
       getFood(name: String): Food! 
       getRandomFood(): Food!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
