
/// BUFER DE EJEMPLO PARA LA LECTURA DE LAS PRIMERAS ENTRADAS 
    //Simulación de la recepción de los datos
        var bufferRecepcion = Buffer.alloc(6);
        bufferRecepcion[0] = 1; // dispositivo
        bufferRecepcion[1] = 2; // funcion
        bufferRecepcion[2] = 1;
        bufferRecepcion[3] = 32; // entrada
        bufferRecepcion[4] = 225;
        bufferRecepcion[5] = 200;
//---

/// BUFFER DE EJEMPLO PARA LECTURA DE LA SEGUNDA FUNCION
        //Simulación de la recepción de los datos
        var bufferRecepcion = Buffer.alloc(60);
        bufferRecepcion[0] = 01
        bufferRecepcion[1] = 04
        bufferRecepcion[2] = 56
        bufferRecepcion[3] = 00
        bufferRecepcion[4] = 00
        bufferRecepcion[5] = 00
        bufferRecepcion[6] = 231
        bufferRecepcion[7] = 00
        bufferRecepcion[8] = 00
        bufferRecepcion[9] = 00
        bufferRecepcion[10] = 221
        bufferRecepcion[11] = 00
        bufferRecepcion[12] = 00
        bufferRecepcion[13] = 00
        bufferRecepcion[14] = 221
        bufferRecepcion[15] = 00
        bufferRecepcion[16] = 00
        bufferRecepcion[17] = 00
        bufferRecepcion[18] = 220
        bufferRecepcion[19] = 00
        bufferRecepcion[20] = 00
        bufferRecepcion[21] = 00
        bufferRecepcion[22] = 222
        bufferRecepcion[23] = 00
        bufferRecepcion[24] = 00
        bufferRecepcion[25] = 00
        bufferRecepcion[26] = 223
        bufferRecepcion[27] = 00
        bufferRecepcion[28] = 00
        bufferRecepcion[29] = 00
        bufferRecepcion[30] = 00
        bufferRecepcion[31] = 04
        bufferRecepcion[32] = 198
        bufferRecepcion[33] = 01
        bufferRecepcion[34] = 154
        bufferRecepcion[35] = 00
        bufferRecepcion[36] = 00
        bufferRecepcion[37] = 00
        bufferRecepcion[38] = 01
        bufferRecepcion[39] = 00
        bufferRecepcion[40] = 01
        bufferRecepcion[41] = 00
        bufferRecepcion[42] = 01
        bufferRecepcion[43] = 00
        bufferRecepcion[44] = 01
        bufferRecepcion[45] = 00
        bufferRecepcion[46] = 01
        bufferRecepcion[47] = 00
        bufferRecepcion[48] = 01
        bufferRecepcion[49] = 00
        bufferRecepcion[50] = 01
        bufferRecepcion[51] = 11
        bufferRecepcion[52] = 54
        bufferRecepcion[53] = 27
        bufferRecepcion[54] = 228
        bufferRecepcion[55] = 00
        bufferRecepcion[56] = 00 
        bufferRecepcion[57] = 00
        bufferRecepcion[58] = 11
        bufferRecepcion[59] = 169
        bufferRecepcion[60] = 60
//---

var net = require('net');
var config = require('./config');
const bodyParser = require('body-parser');
const port = config.port;

var app = require('express')();
var server = app.listen(3055);
var tcpServer = net.createServer();

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


    function ejecucion() {
        // Datos de envío
        var buffer = Buffer.alloc(8);
        buffer[0] = dispositivo; // dispositivo
        buffer[1] = 2; // funcion
        buffer[2] = 0;
        buffer[3] = entrada; // entrada
        buffer[4] = 0;
        buffer[5] = 8;
        buffer[6] = 121;
        buffer[7] = 204;
        //socket.write(buffer);
        
        //Simulación de la recepción de los datos
        var bufferRecepcion = Buffer.alloc(6);
        bufferRecepcion[0] = 1; // dispositivo
        bufferRecepcion[1] = 2; // funcion
        bufferRecepcion[2] = 1;
        bufferRecepcion[3] = 128; // entrada
        bufferRecepcion[4] = 225;
        bufferRecepcion[5] = 200;
        console.log(bufferRecepcion)

        switch (bufferRecepcion[1])
        {
            case 2:
                DINs = bufferRecepcion[3].toString(2).split('')
                var DIN = new Object();
                DIN.DIN0 = DINs[0];
                DIN.DIN1 = DINs[1];
                DIN.DIN2 = DINs[2];
                DIN.DIN3 = DINs[3];
                DIN.DIN4 = DINs[4];
                DIN.DIN5 = DINs[5];
                DIN.DIN6 = DINs[6];
                DIN.DIN7 = DINs[7];

                var Registro = new Object();
                Registro.Fecha = new Date();
                Registro.Dispositivo = bufferRecepcion[0];
                Registro.Funcion = bufferRecepcion[1];
                Registro.Cantidad = bufferRecepcion[2];
                Registro.DIN = DIN;
                Registro.CRCLow = bufferRecepcion[4];
                Registro.CRCHigh = bufferRecepcion[5];
            console.log(Registro);
            break;
            case 4:
            break;
        }
    }
    ejecucion();



});

var bandera = true;
tcpServer.on('connection', (socket) => {
    console.log('dispositivo conectado')
    setInterval(ejecucion, 1000);

    // TIEMPO
    // app.get('/tiempo', function (req, res) {
    //     res.send('tiempo');
    //     let tiempo = req.body.tiempo;
    //     clearInterval(ejecucion);
    //     setInterval(ejecucion, tiempo);
    // });



    socket.on('data', function(datos) {
        console.log(datos)
    });
});