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