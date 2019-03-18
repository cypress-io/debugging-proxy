const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const url = require('url')
const debug = require('debug')('proxy')

function DebuggingProxy(options = {}) {
    this.options = options
    this.setAuth(options.auth)

    this.server = http.createServer((req, res) => {
        if (!this.validateAuth(req)) {
            res.writeHead(401, 'Unauthorized')
            res.end()
            return
        }
        this.proxyRequestToUrl(req.url, req, res)
    })

    this.httpsProxy = httpsProxy
    this.server.addListener('connect', this.httpsProxy.bind(this))

    this.proxy = new httpProxy.createProxyServer()
}

DebuggingProxy.prototype.setAuth = function(auth) {
    if (!auth) {
        this.correctAuth = undefined
        return
    }
    this.correctAuth = `${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}`
}

DebuggingProxy.prototype.validateAuth = function(req) {
    const proxyAuth = req.headers['proxy-authorization']
    return !this.correctAuth || (proxyAuth && proxyAuth.split(' ', 2)[1] !== this.correctAuth)
}

DebuggingProxy.prototype.start = function(port) {
    return new Promise((resolve, reject) => {
        this.server.listen(port, (err) => {
            if (err) {
                return reject(err)
            }
            debug('proxy started on port', port)
            resolve()
        })
    })
}

DebuggingProxy.prototype.stop = function() {
    return new Promise((resolve, reject) => {
        this.server.close((err) => {
            if (err) return reject(err)
            debug('proxy stopped')
            resolve()
        })
    })
}

DebuggingProxy.prototype.proxyRequestToUrl = function(reqUrl, req, res) {
    // stub me
    debug('Request for', reqUrl)
    const { host, protocol } = url.parse(reqUrl)
    const target = `${protocol}//${host}`
    this.proxy.web(req, res, { target }, (e) => {
        console.error("Error requesting", reqUrl, e.message)
    })
}

DebuggingProxy.prototype.httpsProxy = function(req, socket, bodyhead) {
    if (this.validateAuth(req)) {
        socket.write("HTTP/" + req.httpVersion + " 401 Unauthorized\r\n\r\n")
        socket.end()
        return
    }
    this.httpsProxy(req, socket, bodyhead)
}

DebuggingProxy.prototype.proxySslConnectionToDomain = function(domain, port) {
    // stub me
    debug("Proxying HTTPS request for:", domain, port)
}

module.exports = DebuggingProxy
