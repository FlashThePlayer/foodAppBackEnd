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
    patchDay(dayInputs: [DayInputData!]!): [Day!]!
} 

type Query {
    getDays(date: String!): [Day!]
}

`;