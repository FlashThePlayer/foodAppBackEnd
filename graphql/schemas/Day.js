module.exports = `

type Day {
    meals: [Food!]
    date: String!
}

input DayInputData {
    date: String!
    foodId: [String!]!
}

type Mutation {
    deleteFoodFromDay(dayInput: DayInputData!): Day!
    createDay(dayInput: DayInputData!): Day!
    patchDay(dayInput: DayInputData!): Day!
} 

type Query {
    getDays(date: String!): [Day!]
}

`;