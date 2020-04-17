module.exports = (req, res, next) => {
  if (req.headers['auth-token']) req.tokens = { authToken: req.headers['auth-token'] }

  next()
}