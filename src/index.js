var Cvlc   = require('cvlc'),
    player = new Cvlc(),
    fs     = require('fs');



player.cmd('longhelp', function gotCommands(err, response) {
    console.log('Available commands: ' + response);
});

var tracks = fs.readdirSync('/media/pi/0');

// var track = '/media/pi/0/' + tracks[0];
var track;
tracks.forEach(function(t){
    if(t.includes('.opus')){
        track = t;
    }
});

player.play(track, function startedLocalFile() {
    // The file has started playing
    console.log('playing', track);
});
