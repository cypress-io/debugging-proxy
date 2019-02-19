node-debug-proxy
===

[![NPM](https://nodei.co/npm/debug-proxy.svg?downloads=true)](https://npmjs.org/package/debug-proxy)

A simple HTTP proxy that proxies HTTP and HTTPS requests transparently. Useful for debugging that your application works correctly with proxies.

## Installation
```
npm -i g debug-proxy

## or, if you prefer yarn
yarn global add debug-proxy
```

## Usage

### Start the proxy on port 1337
```
debug-proxy
```

### Use a custom port
```
PORT=1234 debug-proxy
```

### Show logs of all requests
```
DEBUG=proxy debug-proxy
```

