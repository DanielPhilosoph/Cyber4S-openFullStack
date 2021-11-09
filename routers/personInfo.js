const express = require("express");
const persons = require("../phonebook");
const Person = require("../mongodb/mongoPerson");
const router = express.Router();

// * main - REST
router.get("/", async (req, res, next) => {
  res.send(
    `Phonebook has info for ${await Person.find(
      {}
    ).count()} peaple.\n${new Date()}`
  );
});

module.exports = router;
