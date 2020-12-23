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
    createDay(dayInput: DayInputData!): Day!
} 

type Query {
    getDays(date: String!): [Day!]
}

`;