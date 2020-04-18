const tokenVerify = require('./verifyTokens')
const customError = require('../utils/CustomErrors')

module.exports = (req, res, next) => {
  if (!req || !req.tokens) {
    throw customError('No tokens provided', 401)
  }

  tokenVerify(req.tokens.authToken)

  next()
}