var net = require('net');
var config = require('./config');
var admin = require('firebase-admin');
var serviceAccount = require('./aunth.json');

const bodyParser = require('body-parser');
const port = config.port;

var app = require('express')();
var server = app.listen(3055);
var tcpServer = net.createServer();

/* Bases de datos */
var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://girhsa-95a6c.firebaseio.com"
});
var firestore = firebase.firestore();

/* Permisos */
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3055');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let dispositivo;
let funcion;
let entrada;

app.get('/comando', function (req, res) {
    dispositivo = req.body.dispositivo;
    funcion = req.body.funcion;
    entrada = req.body.entrada;
    res.send('comando registrado');
});

/* TCP Servidor */

tcpServer.listen(port,function(){
    console.log('Servidor TCP funcionando en: '+port);
    var buffer = Buffer.alloc(8);
    buffer[0] = 4;
    buffer[1] = 0;
    buffer[2] = 10; //
    buffer[3] = 2; //
    buffer[4] = 2; //
    buffer[5] = 10; //
    buffer[6] = 0;
    buffer[7] = 12;
    console.log(buffer)
    var dato = buffer.slice(buffer.length - 6,buffer.length - 2);
    console.log(dato)
    //console.log(dato.readInt16LE(1))
    console.log(dato.readInt32BE())
});

function invertir(cadena) {
    var x = cadena.length;
    var cadenaInvertida = "";
   
    while (x>=0) {
      cadenaInvertida = cadenaInvertida + cadena.charAt(x);
      x--;
    }
    return cadenaInvertida;
  }

var bandera = true;
tcpServer.on('connection', (socket) => {
    console.log('dispositivo conectado')
    if (bandera = true)
    {
        setInterval(ejecucion, 15000);
    } else
    {
        clearInterval(ejecucion)
    }

    function ejecucion() {
        var buffer = Buffer.alloc(8);
        buffer[0] = 1; // dispositivo
        buffer[1] = 2; // funcion
        buffer[2] = 0;
        buffer[3] = 0; // entrada
        buffer[4] = 0;
        buffer[5] = 8;
        buffer[6] = 121;
        buffer[7] = 204;
        socket.write(buffer);

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

    socket.on('close', function(e){
        console.log('El cliente a cerrado la conexión');
        bandera = false;
    });

    socket.on('error', function(e){
        console.log('Connection error: '+e);
        socket.destroy();
    });

    socket.on('data', function(bufferRecepcion) {
        console.log(bufferRecepcion)
        var Registro = new Object();
        switch (bufferRecepcion[1])
        {
            case 2:
                DINs = bufferRecepcion[3].toString(2).split('')
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
                Registro.Contador = bufferRecepcion.readInt16BE(55, 59);
            break;
        }

        Registro.Fecha = new Date();
        Registro.ValorIngreso = bufferRecepcion.toString('hex');
        Registro.Dispositivo = bufferRecepcion[0];
        Registro.Funcion = bufferRecepcion[1];
        Registro.Cantidad = bufferRecepcion[2];
        Registro.CRCLow = bufferRecepcion[bufferRecepcion.length - 2];
        Registro.CRCHigh = bufferRecepcion[bufferRecepcion.length - 1];

        console.log(Registro);
        firestore.collection('Registro').add(Registro)
    });
});