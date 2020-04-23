const redis = require('./utils/redis');
const authenticateReq = require('./middleware/authMiddleware');
const rateLimiter = require('./middleware/rateLimiter');
const tokenSigner = require('./utils/tokenSigner');
const dsPaths = require('./config/paths/development');
const config = require('./config/')();

module.exports = (app, proxy) => {
  // generate auth token for users with an account
  app.post('/authenticate', async (req, res, next) => {
    // bla bla.. pretend they logged in successfully
    const USER_ID = '1234'; // id of user returned from db/service
    const [token, sessionToken] = await Promise.all([tokenSigner(USER_ID),  tokenSigner()])

    res.cookie('sessionToken', sessionToken, {
      expires: new Date(Date.now() + config.token.cookieExpireMs) // cookie will be removed after 1 hours
    }).cookie('authToken', token, {
      expires: new Date(Date.now() + config.token.cookieExpireMs) // cookie will be removed after 1 hours
    }).status(200).send({ sessionToken });
  })

  // get a session token for consumer of API.
  app.get('/session/new', async (req, res, next) => {
    const sessionToken = await tokenSigner();

    res.cookie('sessionToken', sessionToken, {
      expires: new Date(Date.now() + config.token.cookieExpireMs) // cookie will be removed after 1 hours
    }).status(200).send({ sessionToken });
  })

  // protected endpoint - needs token but no login
  app.get('/metaPosts', [authenticateReq(), rateLimiter(redis)], (req, res, next) => {
    res.status(200).send([{  info: '123' }]);
  })

  // authenticated endpoint - needs login
  app.get('/posts', [authenticateReq(true), rateLimiter(redis)], (req, res, next) => {
    res.status(200).send([{  id: '123', name: '345' }]);
  })

  // here is a very basic gateway
  app.all(/^\/api(\/.*)/, (req, res, next) => {
    if (!req.headers.target) res.status(400).send('No Target Specified');
    const target = dsPaths[req.headers.target];
    if (!target) res.status(400).send('Target not found');

    proxy.proxyRequest(req, res, { target }); // would be a bit more complicated than this in reality
  });
}