function errorHandler(err, req, res, next) {
  if (err.status && err.error) {
    res.status(err.status).json({ message: err.error });
  }
  res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
