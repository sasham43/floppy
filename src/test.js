// var resp = `( new input: file:///media/pi/everything.opus )
// ( audio volume: 269 )
// ( state playing )`;
//
// var split = resp.split('\n');
//
// split.forEach(function(s){
//     if(s.includes('state')){
//         var split = s.split(' ');
//         var player_status = split[2];
//     }
//
// })

const Cvlc = require('cvlc');
var player = new Cvlc();

player.cmd(`longhelp`, function(err, response){
    console.log('help', null, response);
    // console.log(`playing track ${index}`);
    // player_status_promise = setInterval(function(){
    //     var new_index = (index >= songs.length - 1) ? index + 1 : -1; // send a -1 if this is the last track, otherwise increment track
    //
    //     checkPlayerStatus(player_status_promise, songs, new_index)
    // }, 1000);
})
