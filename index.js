#!/usr/bin/env node
const { join } = require('path')
const template = require('./lib/template')
const yargs = require('yargs')

const pkg = require(join(__dirname, 'package.json'))

const builder = () => {
  yargs.positional('path', {
    describe: 'path to initialize project in',
    type: 'string',
    default: '.'
  })
}

/* eslint-disable no-unused-expressions */
yargs
  .version('template-version', 'Show version number', pkg.version)
  .command('$0 [path]', 'initiate a new project', builder, template)
  .argv
