var net = require('net');
var config = require('./config');
const port = config.port//502;
var tcpServer = net.createServer();

tcpServer.listen(port,function(){
    console.log('TCP Socket bound to port '+port);
});

var bandera = true;

tcpServer.on('connection', function(socket){
    console.log('client has connected');
    socket.write('123'); // con esto confirmamos la recepción
    
    if (bandera = true)
    {
        setInterval(ejecucion, 9000);
    } else
    {
        clearInterval(ejecucion)
    }
    
    function ejecucion() {
        var buffer = Buffer.alloc(8);
        buffer[0] = 1;
        buffer[1] = 2;
        buffer[2] = 0;
        buffer[3] = 0;
        buffer[4] = 0;
        buffer[5] = 8;
        buffer[6] = 121;
        buffer[7] = 204;

        socket.write(buffer, (data, err) => {
            console.log('connecteison')
            if (err) console.log(err)
            console.log(data)
            console.log('data is: ' + data)
            console.log(typeof(data))
        })
    }

    socket.on('connect', function(e){
        //console.log('Connection error: '+e);
    });

    socket.on('error', function(e){
        console.log('Connection error: '+e);
        socket.destroy();
    });

    socket.on('data', function(e) {
        console.log(e)
        console.log(typeof(e))
        console.log('has recivido un mensaje: ' + e);
    });

    socket.on('close', function(e){
        console.log('Client has closed connection.');
        bandera = false;
    });
});

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