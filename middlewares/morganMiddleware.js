const morgan = require("morgan");

function morganMiddleware(req, res, next) {
  morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
  });
  next();
}

module.exports = morganMiddleware;
