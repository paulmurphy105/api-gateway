const tokenVerify = require('./verifyTokens')

module.exports = (protectedByOAuth = false) => (req, res, next) => {
  if (!req || !req.tokens) {
    return res.status(401).send('No tokens provided');
  }

  if (protectedByOAuth && !req.tokens.authToken) {
    return res.status(401).send('Please provide auth-token');
  }

  if (!req.tokens.sessionToken) {
    return res.status(401).send('Please provide session token');
  }

  try {
    [req.tokens.sessionToken, req.tokens.authToken].forEach(token => tokenVerify(token, protectedByOAuth))
  } catch (error) {
    next(error);
  }

  next()
}
