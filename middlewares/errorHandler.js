function errorHandler(err, req, res, next) {
  if (err.status && err.error) {
    res.status(err.status).json({ message: err.error });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
  next();
}

module.exports = errorHandler;
