const daySchema = `

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
    randomizeDays(date: String!): [Day!]
}

`;

export default daySchema;
