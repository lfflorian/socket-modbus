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

--------


var express = require('express');
var modbus = require("modbus-tcp");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config');


server.listen(config.port, function(socket) {
	console.log(`Servidor corriendo en ${config.port}`);
});

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    
    socket.on('disconnect', function(){
        console.log("Usuario desconectado");
    })

    socket.on('message', function () {
        console.log('Hemos recibido un mensaje: ' + message);
    });
    //socket.emit('messages', messages);
});