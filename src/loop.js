'use strict'

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const filesystem = require('fs-filesystem');
const util = require('util');
const readdir = require('readdir-enhanced');

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

setInterval(checkFile, 5000);

function checkFile(){
    var devices = filesystem(null, (err, data)=>{
        if(err)
            console.log(`err: ${err}`);

        // console.log(`data:`, util.inspect(data, {depth:7}));
        if(data.devices.sda){
            console.log('inserted');
            var mount = cp.spawn('pmount',['/dev/sda1','pi']);
            mount.stdout.on('data', data=>{
                console.log(`pmount: ${data}`);
            });
            mount.stderr.on('data', err=>{
                console.log(`pmount err: ${err}`);
            });
            mount.on('close', data=>{
                console.log(`pmount closed: ${data}`)
                if(data == 0){
                    playFile();
                }
            })
        } else {
            console.log('not inserted');
            var umount = cp.spawn('pumount',['/dev/sda1']);
            umount.stdout.on('data', data=>{
                console.log(`pumount: ${data}`);
            });
            umount.stderr.on('data', err=>{
                console.log(`pumount err: ${err}`);
            });
            umount.on('close', data=>{
                console.log(`pumount closed: ${data}`)
            })
        }
    });
}

function playFile(){
    readdir('/media/pi', {deep: true}, (err, data)=>{
        if(err)
            return console.log('erred out reading a directory, great', err);

        data.forEach(d=>{
            console.log('what is in there', d);
            if(d.includes('.opus')){
                current_track = d;
            }
        });

        // then play it, presumably
    })
}
