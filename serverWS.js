/*var fs = require('fs');
var url = require('url');
var http = require('http');
var WebSocket = require('ws');

// function gửi yêu cầu(response) từ phía server hoặc nhận yêu cầu (request) của client gửi lên
function requestHandler(request, response) {
    fs.readFile('./public/index.html', function(error, content) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(content);
    });
}

// create http server
var server = http.createServer(requestHandler);
var ws = new WebSocket.Server({
    server
});
var clients = [];

function broadcast(socket, data) {
    console.log(clients.length);
    for (var i = 0; i < clients.length; i++) {
        if (clients[i] != socket) {
            clients[i].send(data);
        }
    }
}
ws.on('connection', function(socket, req) {
    clients.push(socket);
    socket.on('message', function(message) {
        console.log('received: %s', message);
        broadcast(socket, message);
    });
    socket.on('close', function() {
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
        console.log('disconnected');
    });
});

server.listen(3000);

console.log('Server listening on port 3000');*/

const path = require('path');
//import express from 'express';
const express = require('express');
//import http from 'http';
const http = require('http');
//import { Server } from 'socket.io';
const Server = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = http.createServer(app);
//const io = new Server(httpServer, { cors: { origin: '*' } });
const io = Server(httpServer);

//app.use(express.static('src/ui'));
app.use(express.static(path.join(__dirname, 'public')));

let buttonState = false;

io.on('connection', socket => {
    console.log('New Connection');

    io.to(socket.id).emit('buttonState', buttonState);

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });

    socket.on('buttonState', value => {
        console.log('buttonState:', value);
        buttonState = value;
        socket.broadcast.emit('buttonState', value);
    });
});

httpServer.listen(PORT, () => {
    console.log('Running on : ', httpServer.address());
});