node-debugging-proxy
===

[![NPM](https://nodei.co/npm/debugging-proxy.svg?downloads=true)](https://npmjs.org/package/debugging-proxy)

A simple HTTP proxy that proxies HTTP and HTTPS requests transparently. Useful for debugging that your application works correctly with proxies.

## Installation
```
npm i -g debugging-proxy

## or, if you prefer yarn
yarn global add debugging-proxy
```

## Usage (as a standalone server)

### Start the proxy on port 1337
```
debugging-proxy
```

### Use a custom port
```
PORT=1234 debugging-proxy
```

### Show logs of all requests
```
DEBUG=proxy debugging-proxy
```

### Require HTTP Basic Auth for proxy access
```
PROXY_USER=some-username PROXY_PASS=some-password debugging-proxy
```

## Usage (as a module, in a test)

```js
const debugProxy = require('debugging-proxy')

// create an instance
const proxy = new debugProxy({
    auth: { // if `auth` is set, HTTP basic authentication to the proxy will be required using these credentials
        username: 'foo',
        password: 'bar'
    },
    keepRequests: false, // if `keepRequests` is set, the proxy will store a log of requests that can be retrieved using `proxy.getRequests()`
})

// using your stubbing/spying library of choice...
spy(proxy.proxyRequestToUrl)
spy(proxy.proxySslConnectionToDomain)

// start an httpproxy on localhost:3000
proxy.start(3000).then(() => {
    // make some requests using the proxy at localhost:3000, then...
    expect(proxy.proxyRequestToUrl).to.be.calledWith('http://google.com')
    expect(proxy.proxySslConnectionToDomain).to.be.calledWith('google.com')

    expect(proxy.getRequests().find(incomingMessage => incomingMessage.ssl === false)).to.exist

    // clean up
    proxy.stop().then(() => {
        console.log('All done!')
    })
})
```
