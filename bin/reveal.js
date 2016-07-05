#! /usr/bin/env node
'use strict'
require('yargs')
.command(require('./commands/new'))
.demand(1)
    .help()
    .argv
