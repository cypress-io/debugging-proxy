node-debugging-proxy
===

[![NPM](https://nodei.co/npm/debugging-proxy.svg?downloads=true)](https://npmjs.org/package/debugging-proxy)

A simple HTTP proxy that proxies HTTP and HTTPS requests transparently. Useful for debugging that your application works correctly with proxies.

## Installation
```
npm -i g debugging-proxy

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

## Usage (as a module, in a test)

```js
const debugProxy = require('debugging-proxy')
debugProxy.start(3000, () => {
    // using your stubbing/spying library of choice...
    stub(debugProxy.proxyRequestToUrl)
    stub(debugProxy.proxySslConnectionToDomain)
    /// make some requests, then...
    debugProxy.proxyRequestToUrl.should.be.calledWith('http://google.com')
    debugProxy.proxySslConnectionToDomain.should.be.calledWith('google.com')
})
```
