var http = require('http');
var config = require('./config');
var ip = require('ip');

const requestHandler = (request, response) => {
    console.log(request.url)
    response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(config.port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`ip address is: ${ip.address()} `)
    console.log(`server is listening on ${config.port}`)
})