var net = require('net');
var config = require('./config');
const port = config.port//502;
var tcpServer = net.createServer();

var admin = require('firebase-admin');
var serviceAccount = require('./aunth.json');
/* Bases de datos */
var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://girhsa-95a6c.firebaseio.com"
});
var firestore = firebase.firestore();

tcpServer.listen(port,function(){
    console.log('TCP Socket bound to port '+port);
});

var bandera = true;

tcpServer.on('connection', function(socket){
    console.log('client has connected');
    socket.write('123'); // con esto confirmamos la recepción
    
    if (bandera = true)
    {
        setInterval(ejecucion, 15000);
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

        socket.write(buffer)

        setTimeout(function () {
            //your code to be executed after 1 second
        }, 6000);

        buffer[0] = 1; // dispositivo
        buffer[1] = 4; // funcion
        buffer[2] = 0;
        buffer[3] = 0; // entrada
        buffer[4] = 0;
        buffer[5] = 28;
        buffer[6] = 241;
        buffer[7] = 195;
        socket.write(buffer);
    }

    socket.on('connect', function(e){
        //console.log('Connection error: '+e);
    });

    socket.on('error', function(e){
        console.log('Connection error: '+e);
        socket.destroy();
    });

    function invertir(cadena) {
        var x = cadena.length;
        var cadenaInvertida = "";

        while (x >= 0) {
            cadenaInvertida = cadenaInvertida + cadena.charAt(x);
            x--;
        }
        return cadenaInvertida;
    }

    socket.on('data', function(e) {
        // var objeto = new Object();
        // objeto.resultado = e.toString('hex');
        // firestore.collection('Registro_2').add(objeto)
        bufferRecepcion = e;
        try {
            
            /// Registro
            var Registro = new Object();
            switch (bufferRecepcion[1])
            {
                case 2:
                    DINs = invertir(bufferRecepcion[3].toString(2)).split('')
                    console.log(DINs)
                    var DIN = new Object();
                    DIN.DIN0 = !! + DINs[0];
                    DIN.DIN1 = !! + DINs[1];
                    DIN.DIN2 = !! + DINs[2];
                    DIN.DIN3 = !! + DINs[3];
                    DIN.DIN4 = !! + DINs[4];
                    DIN.DIN5 = !! + DINs[5];
                    DIN.DIN6 = !! + DINs[6];
                    DIN.DIN7 = !! + DINs[7] == undefined ? false : !! + DIN[7];
                    Registro.DIN = DIN;
                break;
                case 4:
                    var AIN = new Object();
                    AIN.AIN0 = bufferRecepcion.readInt16BE(3,7);
                    AIN.AIN1 = bufferRecepcion.readInt16BE(8,12);
                    AIN.AIN2 = bufferRecepcion.readInt16BE(13,17);
                    AIN.AIN3 = bufferRecepcion.readInt16BE(18,22);
                    AIN.AIN4 = bufferRecepcion.readInt16BE(23,27);
                    AIN.AIN5 = bufferRecepcion.readInt16BE(28,32);
                    Registro.AIN = AIN;
                    Registro.Power = bufferRecepcion.readInt16BE(31, 35) / 100;
                    Registro.Temperatura = bufferRecepcion.readInt16BE(51, 53) / 100;
                    Registro.Humedad = bufferRecepcion.readInt16BE(53, 55) / 100;
                    Registro.Contador = bufferRecepcion.readInt16BE(bufferRecepcion.length - 6, bufferRecepcion.length - 2);
                    console.log(bufferRecepcion.readInt16BE(bufferRecepcion.length - 6, bufferRecepcion.length - 2))
                    console.log(bufferRecepcion.slice(bufferRecepcion.length - 6, bufferRecepcion.length - 2).toString())
                break;
                default:
                    return;
                break;
            }

            Registro.Fecha = new Date();
            Registro.ValorIngreso = bufferRecepcion.toString('hex');
            Registro.Dispositivo = bufferRecepcion[0];
            Registro.Funcion = bufferRecepcion[1];
            Registro.Cantidad = bufferRecepcion[2];
            Registro.CRCLow = bufferRecepcion[bufferRecepcion.length - 2];
            Registro.CRCHigh = bufferRecepcion[bufferRecepcion.length - 1];

            //console.log(Registro);
            firestore.collection('Registro_'+Registro.Funcion).add(Registro)
        }
        catch (error) {
            console.log('Error ' + error)
        }
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