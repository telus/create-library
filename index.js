#!/usr/bin/env node
const yargs = require('yargs')
const template = require('./lib/template')

const builder = () => {
  yargs.positional('path', {
    describe: 'path to initialize project in',
    type: 'string',
    default: '.'
  })
}

/* eslint-disable no-unused-expressions */
yargs
  .version('template-version', 'Show version number')
  .command('$0 [path]', 'initiate a new project', builder, template)
  .argv
