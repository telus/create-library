const { join } = require('path')

const pkg = require(join(__dirname, 'package.json')) // eslint-disable-line import/no-dynamic-require

if (pkg.name.indexOf('@telus') !== 0) {
  throw Error('You cannot publish unscoped packages. The name of your package should begin with "@telus".')
}
