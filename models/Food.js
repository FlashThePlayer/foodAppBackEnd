const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: false },
    favorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    difficulty: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    keywords: [{ type: String, require: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
