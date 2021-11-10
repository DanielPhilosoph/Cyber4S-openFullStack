function errorHandler(err, req, res, next) {
  res.status(err.error).json({ message: err.massege });
}

module.exports = errorHandler;
