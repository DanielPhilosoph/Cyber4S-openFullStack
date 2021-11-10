const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const infoRouter = require("./routers/personInfo");
const morganMiddleware = require("./middlewares/morganMiddleware");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
const app = express();
const presonsRouter = require("./routers/presons");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// * MongoDB connection
const url = `mongodb+srv://daniel_mongo_user:${process.env.PASSWORD}@cluster0.xx3io.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// * Static files
app.use("/", express.static(path.resolve("./dist")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});
app.get("/addContact", (req, res) => {
  console.log("going to next page");
  res.sendFile(path.resolve("./dist/addContact.html"));
});

// * Middlwares
app.use(morganMiddleware);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// * Routers
app.use("/api/persons", presonsRouter);
app.use("/info", infoRouter);

// * error handler middleware
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
