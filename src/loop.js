'use strict'

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const filesystem = require('fs-filesystem');

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

setInterval(checkFile, 5000);

function checkFile(){
    var devices = filesystem(null, (err, data)=>{
        if(err)
            console.log(`err: ${err}`);

        // console.log(`data: ${data}`);
        for (key in data){
            console.log(`${key}: ${data[key]}`);
        }
    });
    // var fdisk = cp.spawn('fdisk -l');
    //
    // fdisk.on('data', (data)=>{
    //     console.log(`fdisk data: ${data}`);
    //     if(data.includes('/dev/sda1')){
    //         console.log('disk inserted');
    //     } else {
    //         console.log('no disk inserted');
    //     }
    // });
    //
    // fdisk.on('error', (err)=>{
    //     console.log(`fdisk error: ${err}`);
    // });
}
