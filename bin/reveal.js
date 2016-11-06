#! /usr/bin/env node
'use strict'
require('yargs')
.command(require('./commands/new'))
.command(require('./commands/deploy'))
.demand(1)
    .help()
    .argv
