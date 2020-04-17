const tokenVerify = require('./verifyTokens')

module.exports = (req, res, next) => {
  if (!req || !req.tokens) {
    const error = new Error('No tokens provided')
    error.status = 401

    throw error
  }

  tokenVerify(req.tokens.authToken)

  next()
}