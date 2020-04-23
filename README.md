# Overview

Very basic API Gateway using Node, Express and redis. There is a built in rate limiter which has utilized some variation of [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket).  
### Prerequisite

Should have [redis](https://hub.docker.com/_/redis/) running


### Installation

```
git clone git@github.com:paulmurphy105/api-gateway.git
cd api-gateway
npm install
npm run dev
```

# Usage

Add an identifier and the url you are targetting to config/paths. This could be the internal url to the deployed micoservice. Passing the identifier as a request header named 'target'. Will proxy the request to this url.

If you add a target to the config like:

'downstreamAPITarget': 'https://downstreamApi.com'

A request like:

`curl --location --request GET 'localhost:3008/api/endpoint' \
--header 'auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MmJiMzFkLWQwMTktNDA3YS04ZDFiLTQ2NDc4YmViMDBiOSIsImNyZWF0ZWRBdCI6MTU4NzYxMzQxMjgwOCwiaWF0IjoxNTg3NjEzNDEyLCJleHAiOjE1ODc2MTcwMTJ9.pIKp2WztPXiXz7EYiOHWzPr0pKXAbgS01ulR9m_yUl0 ' \
--header 'session-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwNDQ3ZGRhLWE1OWItNDUxNy1hYjg0LTcyMTQwNDRkMmYzNiIsImN1c3RvbWVySWQiOiIxMjM0IiwiY3JlYXRlZEF0IjoxNTg3NjEzNDEyODA2LCJpYXQiOjE1ODc2MTM0MTIsImV4cCI6MTU4NzYxNzAxMn0.KDOmz03yNfRReEwb4xUP3MlyYrTyJy9YVXEW_63BLHM' \
--header 'target: downstreamAPITarget' `

would target https://downstreamApi.com/api/endpoint
