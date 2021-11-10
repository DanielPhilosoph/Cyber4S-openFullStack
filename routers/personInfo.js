const express = require("express");
const Person = require("../mongodb/mongoPerson");
const router = express.Router();

// * main - REST
router.get("/", async (req, res) => {
  res.send(
    `Phonebook has info for ${await Person.find(
      {}
    ).count()} peaple.\n${new Date()}`
  );
});

module.exports = router;
