const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const debug = require('debug')('proxy')

const proxy = new httpProxy.createProxyServer()

const port = process.env.PORT || 1337;

const server = http.createServer((req, res) => {
    debug('Request for', req.url)
    proxy.web(req, res, { target: req.url })
}).listen(port, () => {
    console.log(`HTTP proxy listening on http://localhost:${port}`)
})

server.addListener('connect', httpsProxy)
