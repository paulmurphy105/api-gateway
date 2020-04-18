const express = require('express')
var bodyParser = require('body-parser')

const attachTokens = require('./middleware/attachTokens')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(attachTokens)

const app = express()

routes(app)

app.listen(3008, () => console.log('app listening on 3008'));