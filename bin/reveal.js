#! /usr/bin/env node
var yargs = require('yargs');

var argv = yargs.usage("$0 command")
    .command("new", "scaffolds a new revealjs template")
    .command("export", "export slides to a pdf document")
    .command("deploy", "deploy slides")
    .demand(1, "must provide a valid command")
    .help("h")
    .alias("h", "help")
    .argv