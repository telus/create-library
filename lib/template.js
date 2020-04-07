const { join, dirname } = require('path')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')
const glob = require('fast-glob')
const mkdirp = require('mkdirp')

const questions = require('./questions')

// promise helpers
const read = promisify(readFile)
const write = promisify(writeFile)

// path to template directory
const template = join(__dirname, '..', 'template')

// main
module.exports = async function main(argv) {
  // create root folder
  await mkdirp(argv.path)

  let pkg = {}

  try {
    pkg = require(join(process.cwd(), 'package.json')) // eslint-disable-line import/no-dynamic-require
  } catch (e) {} // eslint-disable-line no-empty

  // collect info about the project
  const answers = await questions(pkg)

  // update author info
  const license = answers.license.licenseText
    .replace(/< ?year ?>/i, new Date().getFullYear())
    .replace(/<copyright holders?>/i, 'TELUS Telecommunications Inc.')

  // update answers object
  answers.license = answers.license.key
  answers.private = !answers.oss
  answers.access = answers.oss ? 'public' : 'restricted'
  answers.keywords = ['telus'].concat(answers.topics)

  // write license file
  await write(join(argv.path, 'LICENSE'), `${license}\n`)

  // get all template files
  const stream = glob.stream('**/*', { cwd: template, dot: true })

  stream.on('data', async (file) => {
    const dir = dirname(file)

    // create directory if none-exists
    if (dir !== '.') await mkdirp(join(argv.path, dir))

    // read file content
    let content = await read(join(template, file), 'utf8')

    // replace each template key
    Object.entries(answers).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value)
    })

    // write file to destination
    write(join(argv.path, file === 'gitignore' ? '.gitignore' : file), content)
  })
}
