const morgan = require("morgan");
function middlwares(req, res, next) {
  morgan(":method :url :status :res[content-length] - :response-time ms :body");

  morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
  });
  next();
}

module.exports = middlwares;
