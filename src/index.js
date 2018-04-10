var Cvlc   = require('cvlc'),
    player = new Cvlc(),
    fs     = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var gpio = require('rpi-gpio');

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
gpio.setup(14, gpio.DIR_IN, readInput);
gpio.setup(15, gpio.DIR_IN, readInput);

function readInput() {
    gpio.read(14, function(err, value) {
        console.log('The value 14 is ' + value);
    });
    gpio.read(15, function(err, value) {
        console.log('The value 15 is ' + value);
    });
}


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
