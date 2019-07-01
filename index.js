var express = require('express');
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