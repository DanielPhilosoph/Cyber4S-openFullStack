const express = require("express");
const persons = require("../phonebook");
const Person = require("../mongodb/mongoPerson");
const router = express.Router();
/**
 * *This route routes to:
 * ? /api/persons
 */
router.get("/:id", (req, res, next) => {
  const person = persons.filter((person) => {
    return parseInt(person.id) === parseInt(req.params.id);
  });
  if (person.length === 0) {
    res.status(404).send("Person not found");
  } else {
    res.json(person);
  }
});

router.delete("/:id", (req, res, next) => {
  const person = persons.filter((person) => {
    if (parseInt(person.id) === parseInt(req.params.id)) {
      return true;
    }
  });
  if (person.length === 0) {
    res.status(404).send("Person not found");
  } else {
    persons.splice(persons.indexOf(person), 1);
    console.log(persons);
    res.send(`Deleted ${req.params.id}`);
  }
});

router.post("/", async (req, res, next) => {
  const newPerson = Object.assign({}, req.body);
  if (
    !newPerson.hasOwnProperty("name") ||
    !newPerson.hasOwnProperty("number")
  ) {
    res.status(404).json({ error: "name / number missing from body" });
  } else {
    if (isNameExsits(newPerson.name)) {
      res.status(409).json({ error: "name must be unique" });
    } else {
      if (
        await createNewPerson(generateId(), newPerson.name, newPerson.number)
      ) {
        res.send("Added new contact");
      } else {
        response.status(500).send("Could not add person");
      }
    }
  }
});

router.get("/", (req, res, next) => {
  res.send(persons);
});

module.exports = router;

async function createNewPerson(id, name, number) {
  const person = new Person({ _id: id, name: name, number: number });
  try {
    await person.save();
    return true;
  } catch (error) {
    return false;
  }
}

function generateId() {
  return Math.floor(Math.random() * 10000);
}

function isNameExsits(name) {
  const result = persons.filter((person) => {
    return person.name === name;
  });
  return result.length !== 0;
}
