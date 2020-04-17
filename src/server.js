const express = require('express')
var bodyParser = require('body-parser')

const authenticateReq = require('./middleware/authMiddleware')
const attachTokens = require('./middleware/attachTokens')
const rateLimiter = require('./middleware/rateLimiter')
const tokenSigner = require('./utils/tokenSigner')

const redis = require('./utils/redis')

const app = express()

app.use(bodyParser.json())
app.use(attachTokens)

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

app.listen(3008, () => console.log('app listening on 3008'));