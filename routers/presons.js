const express = require("express");
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
  try {
    const id = Number(req.params.id);
    const response = await Person.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      res.send("delete was not succesful");
    }
    res.end();
  } catch (error) {
    next({ status: 500, error: "Internal server error" });
  }
});

router.post("/", async (req, res, next) => {
  const newPerson = Object.assign({}, req.body);
  if (
    !Object.prototype.hasOwnProperty.call(newPerson, "name") ||
    !Object.prototype.hasOwnProperty.call(newPerson, "number")
  ) {
    return next({ status: 404, error: "name / number missing from body" });
  } else {
    if (await isNameExists(newPerson.name)) {
      return next({ status: 409, error: "name must be unique" });
    } else {
      const isPersonCreated = await createNewPerson(
        generateId(),
        newPerson.name,
        newPerson.number
      );
      if (isPersonCreated.isCreated) {
        res.send("Added new contact");
      } else {
        next({ status: 406, error: isPersonCreated.error });
      }
    }
  }
});

router.put("/", async (req, res, next) => {
  const newPerson = Object.assign({}, req.body);
  if (
    !Object.prototype.hasOwnProperty.call(newPerson, "name") ||
    !Object.prototype.hasOwnProperty.call(newPerson, "number")
  ) {
    return next({ status: 404, error: "name / number missing from body" });
  } else {
    if (await isNameExists(newPerson.name)) {
      let isPersonUpdated = await updatePerson(
        newPerson.name,
        newPerson.number
      );
      if (isPersonUpdated.isUpdated) {
        res.send(`Updated ${newPerson.name}`);
      } else {
        return next({ status: 406, error: isPersonUpdated.error });
      }
    } else {
      return next({ status: 404, error: "Name must exsits in database" });
    }
  }
});

router.get("/", async (req, res) => {
  res.send(await Person.find({}));
});

module.exports = router;

async function createNewPerson(id, name, number) {
  try {
    await Person.create({ _id: id, name: name, number: number });
    return { isCreated: true };
  } catch (error) {
    return { isCreated: false, error: error.message };
  }
}

async function updatePerson(name, number) {
  try {
    let update = await Person.updateOne(
      { name: name },
      { number: number },
      { runValidators: true }
    );
    if (update.matchedCount === 0) {
      return false;
    }
    return { isUpdated: true };
  } catch (error) {
    return { isUpdated: false, error: error.message };
  }
}

function generateId() {
  return Math.floor(Math.random() * 10000);
}

async function isNameExists(name) {
  let persons = await Person.find({});
  return persons.findIndex((obj) => obj.name === name) !== -1;
}
