module.exports = `

type Day {
    date: String!
    meals: [Food!]
}

input createDayInputData {
    date: String!
    foodId: [String!]!
}

type Mutation {
    createDay(dayInput: [createDayInputData!]): Boolean!
} 

type Query {
    getDays(date: String!): [Day!]
}

`;