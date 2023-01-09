
//const socket = io('http://localhost:3000');
const socket = io();

// Envia mensagens ao Servidor
let btn = document.getElementById('btn_send_msg');
btn.addEventListener('click', () => {
    socket.emit('estado', {device:'45:32:12:00:A3:0B', estado:'ON'});
});


// Escuta Mensagens de Broad Cast, envuiadas pelo servidor
socket.on('mensagem_broadcast', (mensagem) => {
    //console.log(mensagem);
    document.getElementById('div_asw').innerHTML = mensagem;
});
