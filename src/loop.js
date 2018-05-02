'use strict'

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const filesystem = require('fs-filesystem');
const util = require('util');
const readdir = require('readdir-enhanced');
const Cvlc = require('cvlc');
var player = new Cvlc();
// var devices = filesystem(null, (err, data)=>{
//     if(err)
//         console.log(`err: ${err}`);
//
//     console.log(`data: ${data}`);
// }));

// remember to wipe the log file when this starts up

// var mode = 'add/remove';
var mode = 'change';

var last_cmd = '';
var prev_evts = [];
var status = 'mounted';

var playing = false;
var current_track = '';

// playFile();

setInterval(checkFile, 5000);

function checkFile(){
    var devices = filesystem(null, (err, data)=>{
        if(err)
            console.log(`err: ${err}`);

        // console.log(`data:`, util.inspect(data, {depth:7}));
        if(data.devices.sda){
            console.log('inserted');
            if(status = 'unmounted'){
                var mount = cp.spawn('pmount',['/dev/sda1','pi']);
                mount.stdout.on('data', data=>{
                    console.log(`pmount: ${data}`);
                });
                mount.stderr.on('data', err=>{
                    console.log(`pmount err: ${err}`);
                    if(err == 'Error: could not lock the mount directory. Another pmount is probably running for this mount point.'){
                        status = 'mounting';
                    }
                });
                mount.on('close', data=>{
                    console.log(`pmount closed: ${data}`)
                    if(data == 0){
                        status = 'mounted';
                        findFile('/media/pi');
                    }
                });
            }
        } else {
            console.log('not inserted');
            if(status != 'unmounted'){
                var umount = cp.spawn('pumount',['/dev/sda1']);
                umount.stdout.on('data', data=>{
                    console.log(`pumount: ${data}`);
                });
                umount.stderr.on('data', err=>{
                    console.log(`pumount err: ${err}`);
                });
                umount.on('close', data=>{
                    console.log(`pumount closed: ${data}`)
                    if(data == 0){
                        status = 'unmounted';
                    }
                });
            }
        }
    });
}

function findFile(dir){
    fs.readdir(dir, (err, data)=>{
        if(err)
            return console.log('erred out reading a directory, great', err);

        data.forEach(d=>{
            console.log('what is in there', d);
            if(d == '0'){
                findFile(dir + '/0');
            }
            if(d.includes('.opus')){
                current_track = `${dir}/${d}`;
                player.play(current_track, function(){
                    console.log('playing');
                });
            }
        });

        // then play it, presumably
    })
}

process.on('SIGINT', function(){
    player.destroy();
});
