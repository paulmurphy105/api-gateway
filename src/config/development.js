module.exports = {
  port: 3008,
  rateLimiter: {
    rateLimitMaxHits: 15, // max requests
    rateLimitTimer: 600, // rateLimitMaxHits for X secs
    secondsBeforeNewToken: 15, // token bucket impl
  },
  token: {
    cookieExpireMs: 60000,
    cookieExpireHr: '1hr'
  }
}