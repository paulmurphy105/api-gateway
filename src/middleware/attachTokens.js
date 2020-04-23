module.exports = (req, res, next) => {
  req.tokens = { authToken: req.headers['auth-token'], sessionToken: req.headers['session-token'] };

  next();
}