var express = require('express');
var app = express();
var server = require('http').Server(app);

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));

var io = require('socket.io')(server);
server.listen(3000, () => console.log('Server started'));

app.get('/', function (req,res) {
  res.render('home')
  console.log('connected');

})
var t;
var h;
app.get('/sensor/:temp/:hmdt', function(req, res) {
    t = (req.params.temp)/100;
    h = (req.params.hmdt)/100
    var time = new Date();
    console.log('----------------------------------');
    console.log(time);
    console.log('Current temperature: ' + t);
    console.log('Current humidity: ' + h);

});

io.on('connection', socket => {
  console.log('Client connected!');
  setInterval(function () {
    io.emit('sensor_data', {temperature: t, humidity: h});
  }, 5000)

})
