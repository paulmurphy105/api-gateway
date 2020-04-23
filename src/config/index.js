const development = require('./development')

module.exports = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return development
    default:
      throw new Error('process.env.NODE_ENV not set')
  }
}