const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const infoRouter = require("./routers/personInfo");
const morganMiddleware = require("./middlewares/morganMiddleware");

const app = express();
const presonsRouter = require("./routers/presons");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
