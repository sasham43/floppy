var resp = `( new input: file:///media/pi/everything.opus )
( audio volume: 269 )
( state playing )`;

var split = resp.split('\n');

split.forEach(function(s){
    if(s.includes('state')){
        var split = s.split(' ');
        var player_status = split[2];
    }

})
