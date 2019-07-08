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

//--------


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


//------------------------


var net = require('net');
var modbus = require('modbus-tcp');
var modbusServer = new modbus.Server();
//
var config = require('./config');
const port = config.port//502;
//
var tcpServer = net.createServer();
tcpServer.listen(port,function(){
    console.log('TCP Socket bound to port '+port);
});

tcpServer.on('connection', function(socket){
    console.log('client has connected');
    modbusServer.pipe(socket);
    socket.on('error', function(e){
        console.log('Connection error: '+e);
        socket.destroy();
    });

    socket.on('data', function(e) {
        console.log('has recivido un mensaje: ' + e);
    });

    socket.on('close', function(e){
        console.log('Client has closed connection.');
    });
});


modbusServer.on('read-coils',readCoils);
modbusServer.on('read-discrete-inputs', readDiscreteInputs);
modbusServer.on('read-holding-registers', readHoldingRegisters);
modbusServer.on('read-input-registers', readInputRegisters);
modbusServer.on('write-multiple-registers',writeRegisters);
modbusServer.on('data', data);

function readCoils(from,to,reply,q) {
    console.log('Read coils '+from+'-'+to);
    console.log('val1: ')
    console.log(q)
    var values = [2,0,8]; // anything greater than zero is received as a 1
    //return reply(null,values);
}

function readDiscreteInputs(from,to,reply,q) {
    console.log('Read DISCRETED inputs '+from+'-'+to);
    console.log('val2: ')
    console.log(q)
    var values = [2,0,8]; // anything greater than zero is received as a 1
    return reply(null,values);
}

function readHoldingRegisters(from,to,reply,q) {
    console.log('Read holding registers '+from+'-'+to);
    console.log('val3: ')
    console.log(q)
    var values = [1,6,3,9]; // sample values just to see if it works.
    return reply(null,bufferify(values));
}

function readInputRegisters(from,to,reply,q) {
    console.log('read Input Registers '+from+'-'+to);
    console.log('val4: ')
    console.log(q)
    var values = [1,6,3,9]; // sample values just to see if it works.
    return reply(null,bufferify(values));
}

function writeRegisters(from,to,items,reply) {
    console.log('Write registers '+from+'-'+to);
    console.log('  items:'+items);
    reply();
}

function data(from,to,reply,q) {
    console.log('Read data '+from+'-'+to);
    console.log('val5: ')
    console.log(q)
}

function bufferify(itemsArray) {
    // When client reads values, have to supply an 
    // array of Buffers (not just an array of numbers) to the reply function.
    var n = itemsArray.length;
    var registers = [];
    for (var i=0; i<n; i++) {
        registers[i] = Buffer.alloc(2);
        registers[i].writeInt16BE(itemsArray[i],0);
    }
}



//-------------------------


'use strict'

const net = require('net')
const modbus = require('jsmodbus')
const config = require('./config')
const netServer = new net.Server()
const holding = Buffer.alloc(10000)
const server = new modbus.server.TCP(netServer, {
  holding: holding
})

server.on('connection', function (client) {
  console.log('New Connection')
})

server.on('readCoils', function (request, response, send) {
  /* Implement your own */
    console.log(request)
    console.log(response)
  response.body.coils[0] = true
  response.body.coils[1] = false

  send(response)
})

server.on('readHoldingRegisters', function (request, response, send) {
    console.log(request)
    console.log(response)
  /* Implement your own */

})

server.on('preWriteSingleRegister', function (value, address) {
  console.log('Write Single Register')
  console.log('Original {register, value}: {', address, ',', server.holding.readUInt16BE(address), '}')
})

server.on('WriteSingleRegister', function (value, address) {
  console.log('New {register, value}: {', address, ',', server.holding.readUInt16BE(address), '}')
})

server.on('writeMultipleCoils', function (value) {
  console.log('Write multiple coils - Existing: ', value)
})

server.on('postWriteMultipleCoils', function (value) {
  console.log('Write multiple coils - Complete: ', value)
})

/* server.on('writeMultipleRegisters', function (value) {
  console.log('Write multiple registers - Existing: ', value)
}) */

server.on('postWriteMultipleRegisters', function (value) {
  console.log('Write multiple registers - Complete: ', holding.readUInt16BE(0))
})

server.on('connection', function (client) {

  /* work with the modbus tcp client */

})

server.coils.writeUInt16BE(0x0000, 0)
server.coils.writeUInt16BE(0x0000, 2)
server.coils.writeUInt16BE(0x0000, 4)
server.coils.writeUInt16BE(0x0000, 6)

server.discrete.writeUInt16BE(0x5678, 0)

server.holding.writeUInt16BE(0x0000, 0)
server.holding.writeUInt16BE(0x0000, 2)

server.input.writeUInt16BE(0xff00, 0)
server.input.writeUInt16BE(0xff00, 2)

console.log(config.port)
netServer.listen(config.port || 8502)



/************ */

// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var vector = {
    getInputRegister: function(addr, unitID) {
        console.log('procesado')
        // Synchronous handling
        return addr;
    },
    getHoldingRegister: function(addr, unitID, callback) {
        console.log('procesado')
        // Asynchronous handling (with callback)
        setTimeout(function() {
            // callback = function(err, value)
            callback(null, addr + 8000);
        }, 10);
    },
    getCoil: function(addr, unitID) {
        console.log('procesado')
        // Asynchronous handling (with Promises, async/await supported)
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve((addr % 2) === 0);
            }, 10);
        });
    },
    setRegister: function(addr, value, unitID) {
        console.log('procesado')
        // Asynchronous handling supported also here
        console.log("set register", addr, value, unitID);
        return;
    },
    setCoil: function(addr, value, unitID) {
        console.log('procesado')
        // Asynchronous handling supported also here
        console.log("set coil", addr, value, unitID);
        return;
    },
    readDeviceIdentification: function(addr) {
        return {
            0x00: "MyVendorName",
            0x01: "MyProductCode",
            0x02: "MyMajorMinorRevision",
            0x05: "MyModelName",
            0x97: "MyExtendedObject1",
            0xAB: "MyExtendedObject2"
        };
    }
};
 
// set the server to answer for modbus requests
console.log("ModbusTCP listening on modbus://0.0.0.0:8502");
var serverTCP = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8502, debug: true, unitID: 1 });
 
serverTCP.on("socketError", function(err){
    console.log('procesado')
    // Handle socket error if needed, can be ignored
    console.error(err);
});