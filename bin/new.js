#! /usr/bin/env node
var shell = require('shelljs');
var yargv = require('yargs');




//Copy the files over to the directory
if(shell.test('-e', 'npm')) {
    shell.exec('echo Works');
}
