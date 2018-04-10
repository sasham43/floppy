var Cvlc   = require('cvlc'),
    player = new Cvlc(),
    fs     = require('fs');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

var listenPort = process.env.PORT || 3000;

// player.cmd('longhelp', function gotCommands(err, response) {
//     console.log('Available commands: ' + response);
// });

var tracks = fs.readdirSync('/media/pi/0');

// var track = '/media/pi/0/' + tracks[0];
var track;
tracks.forEach(function(t){
    if(t.includes('.opus')){
        track = '/media/pi/0/' + t;
    }
});

// player.play(track, function startedLocalFile() {
//     // The file has started playing
//     console.log('playing', track);
// });

app.use(function(err, req, res, next){
  console.log('error:', err);
  res.status(err.statusCode || 500).json(err);
});

app.get('/pause', function(req, res, next){
    player.cmd('pause', function(paused){
        console.log('paused', paused);
        res.send('paused')
    });
});

app.get('/play', function(req, res, next){
    player.cmd('play', function(play){
        console.log('playing', play);
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
