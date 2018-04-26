const fs = require('fs');
const path = require('path');
const cp = require('cp');

// remember to wipe the log file when this starts up

var last_cmd = '';

setInterval(checkFile, 5000);

// checkFile();

function checkFile(){
    fs.readFile(path.join(process.env.HOME, 'floppy-logs/log.txt'), 'utf-8', function(err, resp){
        if(err)
            console.log('err', err);

        var lines = resp.split('\n');
        var evts = [];
        lines.forEach(function(line){
            var split = line.split(' ');
            var type = split[1];
            var syspath = split[split.length - 2];
            if ((type == 'add' || type == 'remove') && syspath.includes('sda1')) {
                evts.push(type);
            }
        });

        // last_cmd = evts[evts.length - 1];
        if (last_cmd != evts[evts.length - 1]) {
            // new cmd
            if (last_cmd == 'add') {
                cp.spawn('pmount', ['/dev/sda1']);
            } else if (last_cmd == 'remove') {
                cp.spawn('pumount', ['/dev/sda1']);
            }
            last_cmd = evts[evts.length - 1];
        }
    });
}
