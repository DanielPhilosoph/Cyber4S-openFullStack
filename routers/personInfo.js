const express = require("express");
const persons = require("../phonebook");
const Person = require("../mongodb/mongoPerson");
const router = express.Router();

// * main - REST
router.get("/", (req, res, next) => {
  console.log(Person.find({}).count());
  res.send(
    `Phonebook has info for ${Person.find({}).count()} peaple.\n${new Date()}`
  );
});

module.exports = router;
