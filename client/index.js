const io = require('socket.io-client');
const socket = io.connect('http://localhost:8000'); 

socket.emit('setParams', {
  username: 'murat45'
});
socket.emit('joinRoom', 'quiz'); 

socket.on('question', (question) => {
  console.log('Soru:', question);
});

socket.on('options', (options) => {
  console.log('Şıklar:', options);
});

socket.on('answer', (answer) => {
  console.log('Doğru cevap:', answer);
});


socket.on('waiting', (waiting) => {
  console.log('Bekle:', waiting);
});

socket.on('gameOver', (message) => {
  console.log('Oyun Bitti:', message);
});

socket.on('countdown', (message) => {
  console.log('Süre:', message);
});


socket.on('gameOver', (sortedUsers) => {
  //Sadece ilk 10 Kullanıcı
  console.log('Sıralanmış Kullanıcılar :', sortedUsers);

  sortedUsers.forEach((user, index) => {
      console.log(`Sıra ${index + 1}: Kullanıcı Adı: ${user.username}, Puan: ${user.score}`);
  });
});

socket.emit('getScore');
//Client getScore ile sunucudan puan istiyor
// Sunucuda getScore tetklendiği zaman clienta cevap olarak kullanıcının scoreunu gonderir
socket.on('userScore', (userScore) => {
    console.log(`Kullanıcının puanı: ${userScore}`);
    
});

const customQuestions = [
  { question: 'Soru 1: Başka bir soru?', answer: 'Doğru Cevap :cevap1',options:"Birinci,ikinci,ucuncu,dordundu"},
  { question: 'Soru 2: Daha farklı bir soru?', answer: 'Doğru Cevap :cevap2',options:"Birinci,ikinci,ucuncu,dordundu" },
  { question: 'Soru 3: Yine yeni bir soru?', answer: 'Doğru Cevap :cevap3',options:"Birinci,ikinci,ucuncu,dordundu" }
];

socket.emit('init',customQuestions);




setTimeout(() => {
  socket.emit('increaseScore');
  socket.emit('increaseTotalTime',2);
  console.log('increaseTotalTime olayı tetiklendi.');
}, 10000); // 10 saniye (10000 milisaniye) bekle
