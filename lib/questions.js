const inquirer = require('inquirer')
const name = require('validate-npm-package-name')

const licenses = require('./licenses')

// validation helpers
const validate = {
  notEmpty: input => input && input.length > 0,
  name: input => name(input).validForNewPackages
}

// the actual questions
module.exports = pkg => inquirer.prompt([
  {
    type: 'confirm',
    name: 'oss',
    message: 'is this an open source project?',
    default: false
  },
  {
    type: 'input',
    name: 'title',
    message: 'project title',
    filter: input => input.trim(),
    validate: validate.notEmpty
  },
  {
    type: 'input',
    name: 'description',
    message: 'project description',
    default: pkg.description,
    filter: input => input.trim(),
    validate: validate.notEmpty
  },
  {
    type: 'input',
    name: 'name',
    message: 'package/repo name',
    default: answers => (pkg.name ? pkg.name.replace(/@.+\//, '') : answers.title.toLowerCase().replace(/[\W_]+/g, '-')),
    filter: input => input.trim(),
    validate: validate.name
  },
  {
    type: 'list',
    name: 'license',
    message: 'choose a license',
    choices: licenses,
    default: answers => pkg.license || (answers.oss ? 'MIT' : 'UNLICENSED')
  },
  {
    type: 'input',
    name: 'topics',
    message: 'keywords to use (comma separated)',
    default: pkg.keywords ? pkg.keywords.filter(keyword => keyword !== 'telus').join(', ') : null,
    filter: input => input.trim().split(',').map(keyword => keyword.trim()),
    validate: validate.notEmpty
  },
  {
    type: 'input',
    name: 'team',
    message: 'maintainers (github team slug)',
    validate: input => validate.notEmpty(input) && !/[^a-z-]/g.test(input)
  }
])
