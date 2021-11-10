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
  obj ? res.send(obj) : next({ status: 404, error: "Contact not found" });
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
    return next({ status: 404, error: "name / number missing from body" });
  } else {
    if (await isNameExists(newPerson.name)) {
      return next({ status: 409, error: "name must be unique" });
    } else {
      if (
        await createNewPerson(generateId(), newPerson.name, newPerson.number)
      ) {
        res.send("Added new contact");
      } else {
        return next({ status: 502, error: "Could not add person" });
      }
    }
  }
});

router.put("/", async (req, res, next) => {
  const newPerson = Object.assign({}, req.body);
  if (
    !newPerson.hasOwnProperty("name") ||
    !newPerson.hasOwnProperty("number")
  ) {
    return next({ status: 404, error: "name / number missing from body" });
  } else {
    if (await isNameExists(newPerson.name)) {
      if (await updatePerson(newPerson.name, newPerson.number)) {
        res.send(`Updated ${newPerson.name}`);
      } else {
        return next({ status: 500, error: "Could not update" });
      }
    } else {
      return next({ status: 404, error: "Name must exsits in database" });
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

async function updatePerson(name, number) {
  let update = await Person.updateOne({ name: name }, { number: number });
  if (update.matchedCount === 0) {
    return false;
  }
  return true;
}

function generateId() {
  return Math.floor(Math.random() * 10000);
}

async function isNameExists(name) {
  let persons = await Person.find({});
  return persons.findIndex((obj) => obj.name === name) !== -1;
}
