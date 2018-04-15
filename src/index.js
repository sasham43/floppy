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

// read track
var device = '/media/pi/0';
try {
    var tracks = fs.readdirSync(device);
} catch(e){
    console.log('no media in here');
    var tracks = [];
}
var track;
var track_name;
tracks.forEach(function(t){
    if(t.includes('.opus')){
        track_name = t;
        track = device + t;
    }
});

// check for new media poller
var poller = setInterval(function(){
    fs.readdir(device, function(err, tracks){
        console.log('read floppy:', tracks);
        if(tracks){
            tracks.forEach(function(t){
                if(t != track_name && t.includes('.opus')){
                    track_name = t;
                    track = device + t;
                    doAPlay();
                }
            });
        } else {
            console.log('no tracks');
        }
    });
}, 5000);

function doAPlay(){
    player.play(track, function(){
        console.log('playing');
        // res.send('playing')
    });
}

// player.cmd('longhelp', function(err, resp){
//     console.log('available commands', resp);
// });

process.on('SIGINT', function(){
    player.destroy();
});

// web commands
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
