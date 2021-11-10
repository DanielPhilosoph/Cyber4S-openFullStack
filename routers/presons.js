const express = require("express");
const persons = require("../phonebook");
const Person = require("../mongodb/mongoPerson");
const router = express.Router();
/**
 * *This route routes to:
 * ? /api/persons
 */
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const obj = await Person.findOne({ _id: id });
  obj ? res.send(obj) : res.status(404).send();
});

router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const response = await Person.deleteOne({ _id: id });
  if (response.deletedCount === 0) {
    res.send("delete was not succesful");
  }
  res.end();
});

router.post("/", async (req, res, next) => {
  const newPerson = Object.assign({}, req.body);
  if (
    !newPerson.hasOwnProperty("name") ||
    !newPerson.hasOwnProperty("number")
  ) {
    res.status(404).json({ error: "name / number missing from body" });
  } else {
    if (await isNameExsits(newPerson.name)) {
      res.status(409).json({ error: "name must be unique" });
    } else {
      if (
        await createNewPerson(generateId(), newPerson.name, newPerson.number)
      ) {
        res.send("Added new contact");
      } else {
        response.status(502).send("Could not add person");
      }
    }
  }
});

router.get("/", async (req, res, next) => {
  res.send(await Person.find({}));
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

async function isNameExsits(name) {
  let persons = await Person.find({});
  return persons.findIndex((obj) => obj.name === name) !== -1;
}
