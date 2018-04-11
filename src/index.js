var Cvlc   = require('cvlc'),
    player = new Cvlc(),
    fs     = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var rpio = require('rpio');

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
rpio.open(16, rpio.INPUT, rpio.PULL_DOWN);
// rpio.open(18, rpio.INPUT, rpio.PULL_DOWN);

var playing = false;

function pollcb(pin)
{
        /*
         * Interrupts aren't supported by the underlying hardware, so events
         * may be missed during the 1ms poll window.  The best we can do is to
         * print the current state after a event is detected.
         */
        var state = rpio.read(pin) ? 'pressed' : 'released';
        console.log('Button event on P%d (button currently %s)', pin, state);

        // if(pin == 18){
        //     player.cmd('pause', function(paused){
        //         console.log('paused', paused);
        //     });
        // } else if (pin == 16){
        //     player.play(track, function(){
        //         console.log('playing');
        //     });
        // }
        if (playing) {
                player.cmd('pause', function(paused){
                    console.log('paused', paused);
                });
        } else {
            player.play(track, function(){
                console.log('playing');
            });
        }
        playing = !playing;
}

rpio.poll(16, pollcb);
// rpio.poll(18, pollcb);


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
