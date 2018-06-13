const Cvlc = require('cvlc');
var player = new Cvlc();

var song = '/media/pi/0/heatwave-small.opus'


player.setFile(`${song}`)

player.cmd(`play --file-caching 10000`, function(err, resp){
    console.log(`${err}`);
    console.log(`${resp}`);
    // player_status_promise = setInterval(function(){
    //     var new_index = (index >= songs.length - 1) ? index + 1 : -1; // send a -1 if this is the last track, otherwise increment track
    //
    //     checkPlayerStatus(player_status_promise, songs, new_index)
    // }, 1000);
})
