'use strict'

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// var Tail = require('tail').Tail;
//
// var tail = new Tail("fileToTail");

// tail.on("line", function(data) {
//   console.log(data);
// });
//
// tail.on("error", function(error) {
//   console.log('ERROR: ', error);
// });

// remember to wipe the log file when this starts up

var last_cmd = '';

setInterval(checkFile, 5000);

// checkFile();

function watchFile() {

}

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
        console.log('running', evts[evts.length - 1], last_cmd);
        if (last_cmd != evts[evts.length - 1]) {
            console.log('last cmd', last_cmd);
            // new cmd
            if (evts[evts.length - 1] == 'add') {
                console.log('mount');
                let mount = cp.spawn('pmount', ['/dev/sda1']);

                mount.stdout.on('data', (data) => {
                  console.log(`mount stdout: ${data}`);
                });

                mount.stderr.on('data', (data) => {
                  console.log(`mount stderr: ${data}`);
                });

                mount.on('close', (code) => {
                  console.log(`mount child process exited with code ${code}`);
                });
            } else if (evts[evts.length - 1] == 'remove') {
                console.log('umount');
                let umount = cp.spawn('pumount', ['/dev/sda1']);

                umount.stdout.on('data', (data) => {
                  console.log(`umount stdout: ${data}`);
                });

                umount.stderr.on('data', (data) => {
                  console.log(`umount stderr: ${data}`);
                });

                umount.on('close', (code) => {
                  console.log(`umount child process exited with code ${code}`);
                });
            }
            last_cmd = evts[evts.length - 1];
        }
    });
}
