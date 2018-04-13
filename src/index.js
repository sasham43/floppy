var Cvlc   = require('cvlc'),
    player = new Cvlc(),
    fs     = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
// var rpio = require('rpio');
const Gpio = require('onoff').Gpio;
const button = new Gpio(4, 'in', 'rising');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

var listenPort = process.env.PORT || 3000;

// read track
var tracks = fs.readdirSync('/media/pi/0');
var track;
tracks.forEach(function(t){
    if(t.includes('.opus')){
        track = '/media/pi/0/' + t;
    }
});

app.use(function(err, req, res, next){
  console.log('error:', err);
  res.status(err.statusCode || 500).json(err);
});

// gpio
var playing = false;
button.watch(function (err, value) {
  if (err) {
    throw err;
  }

  // led.writeSync(value);
  if(playing){
      player.play(track, function(){
          console.log('playing');
          // res.send('playing')
          playing = false;
      });
  } else {
      player.play(track, function(){
          console.log('playing');
          // res.send('playing')
          playing = true;
      });
  }

});

process.on('SIGINT', function () {
  button.unexport();
});


// web commands
app.get('/pause', function(req, res, next){
    player.cmd('pause', function(paused){
        console.log('paused', paused);
        res.send('paused')
    });
});

app.get('/play', function(req, res, next){
    player.play(track, function(){
        console.log('playing');
        res.send('playing')
    });
});

app.get('/fwd', function(req, res, next){
    player.cmd('seek +15s', function(fwd){
        console.log('fwd', fwd);
        res.send('fwd')
    });
});

app.get('/rew', function(req, res, next){
    player.cmd('seek -15s', function(rew){
        console.log('rew', rew);
        res.send('rew')
    })
})

app.listen(listenPort, function(){
  console.log('server listening on port', listenPort + '...');
});
