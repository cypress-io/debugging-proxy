// https://stackoverflow.com/a/32104777/3474615
const regex_hostport = /^([^:]+)(:([0-9]+))?$/

module.exports = {
  getHostPortFromString (hostString, defaultPort) {
    let host = hostString
    let port = defaultPort

    const result = regex_hostport.exec(hostString)
    
    if (result) {
      host = result[1]
      
      if (result[2]) {
        port = result[3]
      }
    }

    return [host, parseInt(port)]
}
}
