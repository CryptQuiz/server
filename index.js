const express = require('express');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const socketIo = require('socket.io');

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = socketIo(server);
const gameOver = 0;

let questions = [
    {
        question: "Soru 1: Başka bir soru?",
        options: ["Birinci", "İkinci", "Üçüncü", "Dördüncü"],
        answer: "Birinci",
    },
    {
        question: "Soru 2: Daha farklı bir soru?",
        options: ["Birinci", "İkinci", "Üçüncü", "Dördüncü"],
        answer: "İkinci",
    },
    {
        question: "Soru 3: Yine yeni bir soru?",
        options: ["Birinci", "İkinci", "Üçüncü", "Dördüncü"],
        answer: "Üçüncü",
    },
];
let users = {};
let currentQuestionIndex = 0;
let waiting = 0;
let init = 0;
let roomName = "tuNNcay";

io.on('connection', (socket) => {
    console.log('Bir istemci bağlandı.');
    socket.on('joinRoom', (room) => {
        socket.join(room); // İstemciyi belirli bir odaya katılması için ekliyoruz
    });
    socket.on('setParams', (params) => {
        socket.username = params.username;
        socket.score = 0;
        console.log('socket id:', socket.id);
        users[socket.id] = {
            username: socket.username,
            score: 0,
            time: 0
        };
        console.log(`Yeni parametreler alındı: username - ${socket.username}, score - ${socket.score}`);
        console.log('Kullanıcılar:', users);
    });
    socket.on('init', () => {
        questions;
        init = 1;
        io.to(roomName).emit('init', init);

        sendQuestion(socket);
    });
    socket.on('increaseScore', () => {
        if (users[socket.id]) {
            users[socket.id].score++;
            console.log(`${socket.username} adlı kullanıcının puanı artırıldı: Yeni Puan - ${users[socket.id].score}`);
        }
    });
    socket.on('increaseTotalTime', (userTime) => {
        if (users[socket.id]) {
            users[socket.id].time += userTime;
        }
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('Bir istemci ayrıldı.');
        console.log('Kalan Kullanıcılar:', users);
    });
});

function sendQuestion(socket) {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        waiting = 0;
        io.to(roomName).emit('waiting', waiting);
        io.to(roomName).emit('question', currentQuestion.question);
        io.to(roomName).emit('options', currentQuestion.options);

        let countdown = 15;
        const countdownInterval = setInterval(() => {
            io.to(roomName).emit('countdown', countdown);
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);
                io.to(roomName).emit('answer', currentQuestion.answer);
                waiting = 1;
                io.to(roomName).emit('waiting', waiting);
                setTimeout(() => {
                    currentQuestionIndex++;
                    sendQuestion(socket);
                }, 5000);
            }
        }, 1000);
    } else {
        io.to(roomName).emit('gameOver', 1);
        let users = {};
        let currentQuestionIndex = 0;
        let waiting = 0;
        let init = 0;
        
         pushdbQuiz();
            
        console.log(users);
    }
}

const getScore = (socket) => {
    if (users[socket.id]) {
        return users[socket.id].score;
    }
    return 0; // Kullanıcı odaya katılmamışsa 0 döndür
};

async function pushdbQuiz() {
    for (const userId in users) {
        if (users.hasOwnProperty(userId)) {
            const user = users[userId];
            const user_name = user.username;
            const score = user.score;
            const time = user.time;
    
            try {
                const post = await prisma.quiz_result.create({
                    data: {
                        user_name: user.username,
                        user_score: user.score,
                        user_time: user.time
                    },
                });
                console.log(`Kullanıcı Adı: ${user_name}, Puan: ${score}, Zaman: ${time}`);
            } catch (error) {
                console.error('Veritabanına yazma hatası:', error);
            }
        }
    }
}

server.listen(8000, () => {
    console.log('Sunucu dinleniyor: http://localhost:3000');
});
