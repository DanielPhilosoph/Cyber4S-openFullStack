const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const infoRouter = require("./routers/personInfo");
const morganMiddleware = require("./middlewares/morganMiddleware");

const app = express();
const presonsRouter = require("./routers/presons");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// * Static files
app.use("/", express.static(path.resolve("./dist")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});

// * Middlwares
app.use(morganMiddleware);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// * Routers
app.use("/api/persons", presonsRouter);
app.use("/info", presonsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
