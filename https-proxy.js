const net = require('net')
const parse = require('./utils/parse')

module.exports = function (req, clientSocket, bodyhead, cb)  {
    const [host, port] = parse.getHostPortFromString(req.url, 443);
    
    const shouldContinueProxying = cb({
        req,
        host,
        port,
        socket: clientSocket,
        head: bodyhead,
    })
    
    // stop the proxy if this returns false
    if (!shouldContinueProxying) {
        return
    }

    const proxySocket = new net.Socket();

    clientSocket.setNoDelay(true)
    proxySocket.setNoDelay(true)
    
    proxySocket.connect(port, host, function (err) {
        if (err) {
            clientSocket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
            clientSocket.end();
            return 
        }
        
        clientSocket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
        proxySocket.write(bodyhead);
    });

    proxySocket.on('data', function (chunk) {
        clientSocket.write(chunk);
    });

    proxySocket.on('end', function () {
        clientSocket.end();
    });

    proxySocket.on('error', function (err) {
        clientSocket.destroy(err)
    });

    clientSocket.on('data', function (chunk) {
        proxySocket.write(chunk);
    });

    clientSocket.on('end', function () {
        proxySocket.end();
    });

    clientSocket.on('error', function (err) {
        proxySocket.destroy(err);
    });
}
