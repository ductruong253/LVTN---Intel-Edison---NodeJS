var mraa = require('mraa');
var pin13 = new mraa.Gpio(13);
pin13.dir(mraa.DIR_OUT);
var state = true;


var express = require('express');
var app = express();
var server = require('http').Server(app);

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));

var io = require('socket.io')(server);
server.listen(3000, () => console.log('Server started'));

app.get('/', function (req,res) {
  state = pin13.read();
  res.render('home')
  console.log('connected');

})
var sensorData;
//client gui http request co kem du lieu thu thap duoc tu cam bien
app.get('/sensor/:temp/:hmdt', function(req, res) {
    var t = (req.params.temp)/100;
    var h = (req.params.hmdt)/100;
    sensorData = {temp: t, humid: h}

    var time = new Date();
    console.log('----------------------------------');
    console.log(time);
    console.log('Current temperature: ' + t);
    console.log('Current humidity: ' + h);

});
//socketIO tra ket qua ve cho browser de hien thi thoi gian thuc
io.on('connection', socket => {
  //gui du lieu thu thap duoc den phia client
  setInterval(function () {
    io.emit('sensor_data', sensorData);
  }, 5000)
  //dieu khien cac cong I/O
  console.log('Client connected!');
  var pin13State = (pin13.read()? "ON" : "OFF");
  console.log(pin13State);
  io.emit('pin13_state', pin13State);
  socket.on('pin13_change', data => {
    console.log(data);
    console.log(state);
    pin13.write(state?0:1);
    state = pin13.read();
    pin13State = (state? "ON" : "OFF");
    io.emit('pin13_state', pin13State);
    console.log(pin13State);
  })

})
