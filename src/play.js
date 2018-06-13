var song = '/media/pi/0/heatwave-small.opus'


player.cmd(`input '${song}' --file-caching 10000`, function(){
    console.log(`playing track ${songs[index]} ${index}`);
    // player_status_promise = setInterval(function(){
    //     var new_index = (index >= songs.length - 1) ? index + 1 : -1; // send a -1 if this is the last track, otherwise increment track
    //
    //     checkPlayerStatus(player_status_promise, songs, new_index)
    // }, 1000);
})
