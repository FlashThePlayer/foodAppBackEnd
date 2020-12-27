module.exports = `
type Food {
    _id: ID!
    name: String!
    link: String!
    pictureLink: String!
    favorite: Boolean!
    rating: Int!
    difficulty: String!
    creator: User!
    keywords: [String!]
    recipe: String!
    createdAt: String!
    updatedAt: String!
}

input FoodInputData {
    name: String!
    link: String!
    pictureLink: String!
    favorite: Boolean!
    rating: Int!
    difficulty: String!
    keywords: [String!]
    recipe: String!
}

type FoodData { 
    foods: [Food!]!
    totalPages: Int!
}

input foodQuery {
    name: String
    favorite: Boolean
    rating: Int
    difficulty: String
}

type Query {
    searchFood(name: String!): [Food!]! 
    getFoods(page: Int, query: foodQuery): FoodData!
    getRandomFood(tags: [String!]): Food!
}

type Mutation {
    createFood(foodInput: FoodInputData): Food!
} 
`;
