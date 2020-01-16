module.exports = `
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

input FoodInputData {
    name: String!
    link: String!
    favorite: Boolean!
    rating: Int!
    difficulty: String!
    keywords: [String!]
}

type Query {
    getFood(name: String): Food! 
    getRandomFood: Food!
}

type Mutation {
    createFood(foodInput: FoodInputData): Food!

} 
`;
