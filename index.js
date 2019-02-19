const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const url = require('url')
const debug = require('debug')('proxy')

const proxy = new httpProxy.createProxyServer()

const port = process.env.PORT || 1337;

const server = http.createServer((req, res) => {
    const { host, protocol } = url.parse(req.url)
    const target = `${protocol}//${host}`
    debug('Request for', req.url, host, protocol)
    proxy.web(req, res, { target })
}).listen(port, () => {
    console.log(`HTTP proxy listening on http://localhost:${port}`)
})

server.addListener('connect', httpsProxy)
