const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    addedFood: [{ type: Schema.Types.ObjectId, ref: "Food", required: true }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User", required: false }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
