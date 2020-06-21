import http from 'http'
import url from 'url'
import net from 'net'

const proxy = {
  createProxyServer () {

    // http proxy
    const proxyServer = http.createServer(function (clientReq, clientRes) {
      const reqUrl = url.parse(clientReq.url)
      if (/sogou/.test(reqUrl.hostname)) {
        console.log('proxy for http request: ' + reqUrl.href)
      }
    
      const options = {
        hostname: reqUrl.hostname,
        port: reqUrl.port,
        path: reqUrl.path,
        method: clientReq.method,
        headers: clientReq.headers,
      }
    
      const serverConnection = http.request(options, function (res) {
        clientRes.writeHead(res.statusCode, res.headers)
        res.pipe(clientRes)
      })
    
      clientReq.pipe(serverConnection)
    
      clientReq.on('error', function (e) {
        console.log('client socket error: ' + e)
      })
      
      serverConnection.on('error', function (e) {
        console.log('server socket error: ' + e)
      })
    })


    // https proxy
    proxyServer.on('connect', (clientReq, clientSocket, head) => {
      const reqUrl = url.parse('https://' + clientReq.url)
      if (/sogou/.test(reqUrl.hostname)) {
        console.log('proxy for https request: ' + reqUrl.href + '(path encrypted by ssl)')
      }
    
      const options = {
        port: reqUrl.port,
        host: reqUrl.hostname,
      }
    
      const serverSocket = net.connect(options, () => {
        clientSocket.write(
          'HTTP/' +
          clientReq.httpVersion +
          ' 200 Connection Established\r\n' +
          'Proxy-agent: Node.js-Proxy\r\n\r\n' +
          'UTF-8', () => {
            serverSocket.write(head)
            serverSocket.pipe(clientSocket)
            clientSocket.pipe(serverSocket)
          })
      })
    
      clientSocket.on('error', (e) => {
        console.log("client socket error: " + e)
        serverSocket.end()
      })
      
      serverSocket.on('error', (e) => {
        console.log("forward proxy server connection socket error: " + e)
        clientSocket.end()
      })
    })
    
    // client error handling
    proxyServer.on('clientError', (err, clientSocket) => {
      console.log('client error: ' + err)
      clientSocket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })

    return proxyServer
  }
}

export default proxy