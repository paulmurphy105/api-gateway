
const { promisify } = require("util");
const md5 = require('md5');

module.exports = (redis) => {
  const getAsync = promisify(redis.get).bind(redis);
  const setAsync = promisify(redis.set).bind(redis);
  const ttlAsync = promisify(redis.ttl).bind(redis);

  const hitLimit = (cacheEntry) => parseInt(cacheEntry, 16) < 1;

  return async (req, res, next) => {
    const hash = md5(req.headers);

    const [cacheEntry, ttl] = await Promise.all([getAsync(hash), ttlAsync(hash)])
    console.log(cacheEntry, ttl);


    if (cacheEntry && ttl > 0) {
      if (hitLimit(cacheEntry)) {
        console.log('You have hit your damn limit');

        const rateLimitError = new Error('You have hit your rate limit')
        rateLimitError.status = 429

        next(rateLimitError)
      } else {
        const newValue = cacheEntry - 1;
        await setAsync(hash, newValue, 'EX', 60)
      }
    }

    if (!cacheEntry) {
      await setAsync(hash, 5, 'EX', 60)
    }

    next();
  }
}