const httpProxy = require('http-proxy')
const httpsProxy = require('./https-proxy')
const http = require('http')
const url = require('url')
const debug = require('debug')('proxy')

const proxy = new httpProxy.createProxyServer()

const server = http.createServer((req, res) => {
    proxyRequestToUrl(req.url, req, res)
})

server.addListener('connect', httpsProxy)

const proxyRequestToUrl = (reqUrl, req, res) => {
    // stub me
    debug('Request for', reqUrl)
    const { host, protocol } = url.parse(reqUrl)
    const target = `${protocol}//${host}`
    proxy.web(req, res, { target }, (e) => {
        console.error("Error requesting", reqUrl, e.message)
    })

}

module.exports = {
    start: (port) => {
        return new Promise((resolve, reject) => {
            server.listen(port, (err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    },

    proxyRequestToUrl,

    proxySslConnectionToDomain: httpsProxy.proxySslConnectionToDomain
}
