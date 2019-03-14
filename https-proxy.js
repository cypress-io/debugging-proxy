const net = require('net')

// https://stackoverflow.com/a/32104777/3474615
var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;

    var result = regex_hostport.exec(hostString);
    if (result != null) {
      host = result[1];
      if (result[2] != null) {
        port = result[3];
      }
    }

    return ( [host, port] );
};

module.exports = function (req, socket, bodyhead)  {
    var hostPort = getHostPortFromString(req.url, 443);
    var hostDomain = hostPort[0];
    var port = parseInt(hostPort[1]);
    this.proxySslConnectionToDomain(hostDomain, port)

    socket.setNoDelay(true)

    var proxySocket = new net.Socket();
    proxySocket.connect(port, hostDomain, function () {
        proxySocket.setNoDelay(true)
        socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
        proxySocket.write(bodyhead);
    });

    proxySocket.on('data', function (chunk) {
        socket.write(chunk);
    });

    proxySocket.on('end', function () {
        socket.end();
    });

    proxySocket.on('error', function () {
        socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
        socket.end();
    });

    socket.on('data', function (chunk) {
        proxySocket.write(chunk);
    });

    socket.on('end', function () {
        proxySocket.end();
    });

    socket.on('error', function () {
        proxySocket.end();
    });
}
