const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const debug = require('debug')('proxy')

const proxy = new httpProxy.createProxyServer()

const server = http.createServer((req, res) => {
    debug('Request for', req.url)
    proxy.web(req, res, { target: req.url })
}).listen(process.env.PORT || '1337')

server.addListener('connect', httpsProxy)
