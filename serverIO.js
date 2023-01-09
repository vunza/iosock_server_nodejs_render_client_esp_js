const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const app = express();


// Configurações
app.set('porto', process.env.PORT || 3000);


// Arquivos estáticos, do lado Cliente
app.use(express.static(path.join(__dirname, 'public')));


// Iniciar Servidor
const servidor = app.listen(app.get('porto'), () =>{
    console.log(`Servidor inicializado em : ${app.get('porto')}`);
});


// Servir API
const micros = require(path.join(__dirname, 'arqsjson/micros.json'));
app.get('/arqsjson', (requisicao, resposta) => {
	return resposta.json(micros);
});

 

// WebSockets
const io = socketio(servidor);

// Processa evetnto 'connection'
io.on('connection', (socket_info) => {
    console.log(`Nova conexão, ID: ${socket_info.id}`);

    // Processa evetnto 'disconnect'
    socket_info.on('disconnect', () => {
        console.log(`Conexão terminada.`);
    }); 

    // Processa msg enviadas por clientes sockets
    socket_info.on('estado', (dados) => {
        
        console.log(`Device: ${dados.device}, Estado: ${dados.estado}`);

        // Difunde mensagem à todos clientes    
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        io.emit('mensagem_broadcast', `BROADCAST:<br>Device: ${dados.device}<br>Estado: ${dados.estado}<br>Data: ${dateTime}`);
    });

});

