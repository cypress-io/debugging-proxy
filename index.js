const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const url = require('url')
const debug = require('debug')('proxy')

function DebuggingProxy() {
    this.server = http.createServer((req, res) => {
        proxyRequestToUrl(req.url, req, res)
    })

    this.server.addListener('connect', this.httpsProxy.bind(this))

    this.proxy = new httpProxy.createProxyServer()
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

DebuggingProxy.prototype.httpsProxy = httpsProxy

DebuggingProxy.prototype.proxySslConnectionToDomain = function(domain, port) {
    // stub me
    debug("Proxying HTTPS request for:", domain, port)
}

module.exports = DebuggingProxy
