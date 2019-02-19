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

## Usage

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

