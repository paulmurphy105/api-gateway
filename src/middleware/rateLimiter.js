
const { promisify } = require("util");
const md5 = require('md5');

const customError = require('../utils/CustomErrors');
const config = require('../config/')().rateLimiter;

const hitLimit = (cacheEntry) => parseInt(cacheEntry, 16) < 1;
const handleRateLimitExceeded = (res, next) => {
  res.set({
    'X-RateLimit-Limit': config.rateLimitMaxHits,
    'X-RateLimit-Remaining': 0,
    'X-RateLimit-Reset': rateLimitReset
  });

  next(customError('You have hit your rate limit', 429));
};

module.exports = (redis) => {
  const getAsync = promisify(redis.get).bind(redis);
  const setAsync = promisify(redis.set).bind(redis);
  const ttlAsync = promisify(redis.ttl).bind(redis);
  let rateLimitRemaining;
  let rateLimitReset;

  return async (req, res, next) => {
    const userFingerprint = md5(req.headers); // would probably try to get a better fingerpriint in reality

    const [cacheEntryString, ttl] = await Promise.all([getAsync(userFingerprint), ttlAsync(userFingerprint)]);
    const cacheEntry = JSON.parse(cacheEntryString);

    if (cacheEntry) {
      const elapsedSec = (Date.now() -  cacheEntry.lastHit) / 1000;
      const tokensToAdd = Math.floor(elapsedSec / config.secondsBeforeNewToken); // Add 1 token every X seconds since last request (Token bucket)
      const newCacheLimit = cacheEntry.counter + tokensToAdd;

      console.log('ttl', ttl); // logging for debugging purposes

      if (hitLimit(newCacheLimit)) {
        return handleRateLimitExceeded(res, next)
      } else {
        await setAsync(userFingerprint, JSON.stringify({ counter: newCacheLimit - 1, lastHit: Date.now(), createdAt: cacheEntry.createdAt  }), 'EX', config.rateLimitTimer);

        rateLimitRemaining = newCacheLimit - 1;
        rateLimitReset = cacheEntry.createdAt + (60 * 1000);
      }
    }

    if (!cacheEntry) {
      await setAsync(userFingerprint, JSON.stringify({ counter: config.rateLimitMaxHits, lastHit: Date.now(), createdAt: Date.now() }), 'EX', 60);

      rateLimitRemaining = config.rateLimitMaxHits;
      rateLimitReset = Date.now() + (60 * 1000);
    }

    res.set({
      'X-RateLimit-Limit': config.rateLimitMaxHits,
      'X-RateLimit-Remaining': rateLimitRemaining,
      'X-RateLimit-Reset': rateLimitReset
    });

    next();
  }
}
