const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, minlength: 3 },
  number: { type: String, minlength: 8 },
});
const Person = mongoose.model("person", personSchema);

module.exports = Person;
