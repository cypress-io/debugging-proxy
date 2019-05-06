const url = require('url')
const http = require('http')
const https = require('https')
const debug = require('debug')('proxy')
const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const { getHostPortFromString } = require('./utils/parse')

function DebuggingProxy(options = {}) {
    this.options = options
    this.setAuth(options.auth)

    this.requests = []

    const { onConnect, onRequest } = this.options

    // set onRequest callback function to options to default
    this.onRequest = onRequest || this._onRequest

    // set onConnect callback function to options to default
    this.onConnect = onConnect || this._onConnect

    const requestListener = (req, res) => {
        return this.onRequest(req.url, req, res)
    }

    const connectListener = (req, socket, head) => {
        if (this.options.keepRequests) {
            req.https = true
            this.requests.push(req)
        }

        return this._httpsProxy(req, socket, head, this.onConnect)
    }

    if (options.https) {
        this.server = https.createServer(options.https, requestListener)
    } else {
        this.server = http.createServer(requestListener)
    }

    this._httpsProxy = httpsProxy
    this.server.addListener('connect', connectListener)

    this.proxy = httpProxy.createProxyServer()
    this.server.on('upgrade', (req, socket, head) => {
        debug('ws request received for', req.url)
        if (options.keepRequests) {
            req.ws = true
            this.requests.push(req)
        }
        const { host, protocol } = url.parse(req.url)
        const target = `${protocol}//${host}`
        this.proxy.ws(req, socket, head, { target })
    })
}

DebuggingProxy.prototype.getRequests = function() {
    return this.requests
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
    return !this.correctAuth || (proxyAuth && proxyAuth.split(' ', 2)[1] === this.correctAuth)
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

DebuggingProxy.prototype.getHostPortFromString = getHostPortFromString

DebuggingProxy.prototype._onRequest = function(reqUrl, req, res) {
    // stub me
    if (!this.validateAuth(req)) {
        res.writeHead(401, 'Unauthorized')
        res.end()
        return
    }

    if (this.options.keepRequests) {
        this.requests.push(req)
    }

    debug('Request for', reqUrl)
    const { host, protocol } = url.parse(reqUrl)
    const target = `${protocol}//${host}`
    this.proxy.web(req, res, { target }, (e) => {
        // https://github.com/nodejitsu/node-http-proxy/blob/a3fe02d651d05d02d0ced377c22ae8345a2435a4/examples/http/error-handling.js#L47
        res.writeHead(502);
        res.end("There was an error proxying your request");
        debug("Error requesting", reqUrl, e.message)
    })
}

DebuggingProxy.prototype.httpsProxy = function(req, socket, bodyhead) {
    if (!this.validateAuth(req)) {
        socket.write("HTTP/" + req.httpVersion + " 401 Unauthorized\r\n\r\n")
        socket.end()
        return
    }

    this._httpsProxy(req, socket, bodyhead)
}

DebuggingProxy.prototype._onConnect = function(domain, port) {
    // stub me
    debug("Proxying HTTPS request for:", domain, port)

    return true
}

module.exports = DebuggingProxy
