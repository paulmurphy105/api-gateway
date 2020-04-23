const express = require('express');
var bodyParser = require('body-parser');
const { createProxyServer } = require('http-proxy');

const config = require('./config/')()
const attachTokens = require('./middleware/attachTokens');
const routes = require('./routes');

const app = express();

const proxy = createProxyServer();

app.use(bodyParser.json());
app.use(attachTokens);

routes(app, proxy);

app.listen(config.port, () => console.log(`app started on ${config.port}`));