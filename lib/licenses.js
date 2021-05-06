const spdx = require('spdx-license-list/full')

const unlicensed = [
  {
    name: 'UNLICENSED',
    value: {
      key: 'UNLICENSED',
      name: 'UNLICENSED',
      licenseText: '(c) Copyright <year> TELUS Telecommunications Inc. all rights reserved'
    }
  }
]

const approved = [
  'ISC',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'Apache-2.0',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'LGPL-3.0-only',
  'LGPL-3.0-or-later',
  'MIT'
]

const opensource = Object.entries(spdx)
  // only use approved licenses
  .filter(([key]) => approved.includes(key))

  // structure objects for use with `inquirer`
  .map(([key, value]) => ({ name: value.name, value: { key , ...value } }))

module.exports = unlicensed.concat(opensource)
