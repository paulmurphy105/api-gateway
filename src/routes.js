const redis = require('./utils/redis')
const authenticateReq = require('./middleware/authMiddleware')
const rateLimiter = require('./middleware/rateLimiter')
const tokenSigner = require('./utils/tokenSigner')

module.exports = (app) => {
  app.post('/login', async (req, res, next) => {
    const token = await tokenSigner();

    res.cookie('authToken', token, {
      expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
    }).status(200).send(`logged In ${token}`)
  })

  app.get('/posts', authenticateReq, (req, res, next) => {
    res.status(200).send([{  id: '123', name: '345' }])
  })

  app.get('/test', rateLimiter(redis), (req, res, next) => {
    res.status(200).send([{  id: '123', }])
  })

}