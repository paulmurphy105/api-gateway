
const { promisify } = require("util");
const md5 = require('md5');

const customError = require('../utils/CustomErrors')

module.exports = (redis) => {
  const getAsync = promisify(redis.get).bind(redis);
  const setAsync = promisify(redis.set).bind(redis);
  const ttlAsync = promisify(redis.ttl).bind(redis);

  const hitLimit = (cacheEntry) => parseInt(cacheEntry, 16) < 1;

  return async (req, res, next) => {
    const hash = md5(req.headers);

    const [cacheEntryString, ttl] = await Promise.all([getAsync(hash), ttlAsync(hash)])
    const cacheEntry = JSON.parse(cacheEntryString);

    if (cacheEntry && ttl > 0) {
      const elapsedSec = (Date.now() -  cacheEntry.lastHit) / 1000
      const tokensToAdd = Math.floor(elapsedSec / 15) // Add 1 token every 15 seconds since last request
      const newCacheLimit = cacheEntry.counter + tokensToAdd;

      // console.log(`elapsed: ${elapsedSec}`);
      // console.log(`tokensToAdd: ${tokensToAdd}`);
      // console.log(`newCacheLimit: ${newCacheLimit}`);

      let rateLimitRemaining
      let rateLimitReset

      if (hitLimit(newCacheLimit)) {
        next(customError('You have hit your rate limit', 429))
      } else {
        await setAsync(hash, JSON.stringify({ counter: newCacheLimit - 1, lastHit: Date.now(), createdAt: cacheEntry.createdAt  }), 'EX', 60)
        rateLimitRemaining = newCacheLimit - 1;
        rateLimitReset = cacheEntry.createdAt + (60 * 1000)
      }
    }

    if (!cacheEntry) {
      await setAsync(hash, JSON.stringify({ counter: 3, lastHit: Date.now(), createdAt: Date.now() }), 'EX', 60)
      rateLimitRemaining = 3
      rateLimitReset = Date.now() + (60 * 1000)
    }

    res.set({
      'X-RateLimit-Limit': '3',
      'X-RateLimit-Remaining': rateLimitRemaining,
      'X-RateLimit-Reset': rateLimitReset
    })

    next();
  }
}