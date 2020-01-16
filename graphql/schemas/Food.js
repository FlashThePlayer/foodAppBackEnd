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

type FoodData {
    foods: [Food!]!
    totalPages: Int!
}

type Query {
    getFood(name: String!): Food! 
    getFoods(page: Int): FoodData!
    getRandomFood: Food!
}

type Mutation {
    createFood(foodInput: FoodInputData): Food!

} 
`;
