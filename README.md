# NPM Library Initializer

[![version][npm-image]][npm-url] [![Build Status][circle-image]][circle-url]

> an opinionated [npm package initializer][npm/init]

## Requirements

- `npm >= 6.x`
- `node >= 8.*`

## Usage

```bash
npm init @telus/library
```

## How does this work?

> _`npm init <initializer>` can be used to set up a new or existing npm package._

> _`initializer` in this case is an npm package named `create-<initializer>`, which will be installed by `npx`, and then have its main bin executed -- presumably creating or updating `package.json` and running any other initialization-related operations._

> _[&mdash; Source: `docs.npmjs.com`][npm/init]_

---
> Github: [@telus](https://github.com/telus) &bull; 
> Twitter: [@telusdigital](https://twitter.com/telusdigital)

[circle-url]: https://circleci.com/gh/telus/create-library
[circle-image]: https://img.shields.io/circleci/project/github/telus/create-library/master.svg?style=for-the-badge&logo=circleci

[npm-url]: https://www.npmjs.com/package/@telus/create-library
[npm-image]: https://img.shields.io/npm/v/@telus/create-library.svg?style=for-the-badge&logo=npm

[npm/init]: https://docs.npmjs.com/cli/init#description
