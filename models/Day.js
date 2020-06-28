const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daySchema = new Schema(
    {
        date: { type: Date, required: true },
        foods: [{ type: Schema.Types.ObjectId, ref: "Food", required: false }],
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Day", daySchema);
