const express = require('express');
const axios = require('axios');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Добавляем обработку статических файлов
app.use(express.static('public'));

// Обработка POST-запросов на /log с сообщениями
app.post('/log', express.text(), (req, res) => {
    const message = req.body;
    io.emit('new_message', message);
    res.sendStatus(200);
});

// Отправка сообщений на удаленный сервер
async function sendMessage(message) {
    try {
        await axios.post('http://192.168.20.137:80/message', message);
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
}

// Реализация long polling с использованием Socket.io
io.on('connection', (socket) => {
    socket.on('send_message', (message) => {
        sendMessage(message);
    });
});

const port = 3323;
server.listen(port, '0.0.0.0', () => {
    console.log(`Сервер работает на порту ${port}`);
});