'use strict'

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// remember to wipe the log file when this starts up

// var mode = 'add/remove';
var mode = 'change';

var last_cmd = '';
var prev_evts = [];
var status = 'mounted';

setInterval(checkFile, 5000);

function checkFile(){
    var fdisk = cp.spawn('sudo fdisk -l');

    fdisk.on('data', (data)=>{
        console.log(`fdisk data: ${data}`);
        if(data.includes('/dev/sda1'){
            console.log('disk inserted');
        } else {
            console.log('no disk inserted');
        }
    });

    fdisk.on('error', (err)=>{
        console.log(`fdisk error: ${err}`);
    });
}
