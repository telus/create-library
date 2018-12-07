# NPM Library Initializer

[![version][npm-image]][npm-url] [![Build Status][circle-image]][circle-url]

An opinionated [npm package initializer][npm-init]. Scaffolds an npm library tree with fully configured CI automation, using a predefined [template](./template).

- [Requirements](#step-1)
- [What's included](#step-2)
- [Usage](#step-3)
- [Local development gotchas](#step-4)
- [How do I migrate existing libraries?](#step-5)

## <a id="step-1"></a> Requirements

- `npm >= 6.x`
- `node >= 8.*`

## <a id="step-2"></a> What's included?

This NPM library initializer is a CLI tool that makes the process of creating and publishing a new NPM package significantly easier and faster. Here's what you get out of the box:
- Scaffolded NPM library, with automatically generated `package.json` and Github settings based on user input
- Github repository settings as code living in the repository of your library (see [probot/settings][probot-settings] for more details)
- CircleCI [configuration file](./template/circle.yml) for a standard pipeline, including the following jobs: `build`, `lint`, `test`, and `release`
- Automated version management and NPM package publishing using [semantic-release][semantic-release], that uses formalized commit message convention to document changes in the codebase
- Basic setup for unit tests with [tap][tap]
- Security auditing using [npm audit][npm-audit]
- Dependencies auditing using [updated][updated], and a command to automatically install updates
- `.editorconfig` linting using [editorconfig-checker][editorconfig]
- Javascript linting using [eslint][eslint], and a command to automatically fix most small issues
- Markdown linting for your README files using [remark-cli][remark-cli], and a command to automatically fix most small issues
- Automated dependency updates using [renovate bot][renovate]

Some of the tools mentioned above rely on centralized configuration files, that allow us to achieve consistency across all of the applications built by our team, and remove duplicated configs across all of our repositories. You are welcome to open a PR in either of these if you would like to suggest any changes:
- `eslint` (Javascript linting) - see [@telus/eslint-config][telus/eslint-config]
- `remark` (Markdown linting) - see [@telus/remark-config][telus/remark-config]
- `semantic-release` (automated version management and NPM publishing) - see [@telus/semantic-release-config][telus/semantic-release-config]

## <a id="step-3"></a> Usage

```bash
npm init @telus/library
```




***** banana



When you run `npm init @telus/library`, you will be prompted with a few questions. Here's what you need to know to be ready:
- if your project will be open source (Y/N)
- project title
- project description
- repository name
- license type (read more about license types [here][github-licenses])
- keywords
- maintainers (Github team slug)

### What's this `npm init` magic?

The `npm init` command was solely used to create a new `package.json` file. As of npm v6.1.0, `npm init` can be used as an initializer by passing the name of the package you want initialized after `npm init`; npm will prepend `create-` to the name of the initializer you provide and use `npx` to temporarily install and execute that project. You can read more about this [here][npm-init].

As a result, this is what happens after you run `npm init @telus/library`:
- The command `npm init @telus/library` gets transformed and run as `npx @telus/create-library`, which will install and execute the current package.
- Executing this package means running [index.js](./index.js), which starts the CLI and collects all of your answers.
- As soon as all answers are collected and minimally processed, they are used to populate placeholders (see [template.js](./lib/template.js)) in the files located inside the `template` folder. 
- The entire contents of the `template` folder (with the placeholders filled with your info) gets copied in the location where the command was run.
- Now you can start working on your library!

## <a id="step-4"></a> Local development gotchas

You might notice in the template [CircleCI configuration file](./template/circle.yml) that we use a particular Docker image called `telus/build-essential` as a base image. That ensures we get access to some globally installed packages needed to run the various steps in the pipeline. 

In order to make these scripts work in local development, you will need to ensure you have those packages installed on your machine. Running `npx install-group peer --package @telus/build-essential --no-save` inside your project folder will make those dependencies available. For convenience, we have added a script for this inside the template `package.json`: `npm run setup-local`.

## <a id="step-5"></a> How do I migrate existing libraries?

If you are thinking of bringing these updates into an existing NPM library, and don't know where to start, here are a few tips on how you could approach this:
- Create a new branch in your project.
- While on your newly created branch, inside the main folder of your application, run `npm init @telus/library`.
- You'll probably notice that this will create a few new files, and also modify some existing ones.
- Use your IDE or any diffing tool to walk through the changes and remove any unnecessary files.
- Pay special attention to `package.json` and your `README` files, as these will be completely replaced; however, you'll want to merge what you had in there before with what gets generated.
- If you run into any issues, reach out to the [Architecture Support Team][ast-confluence].

---
> Github: [@telus](https://github.com/telus) &bull;
> Twitter: [@telusdigital](https://twitter.com/telusdigital)

[circle-url]: https://circleci.com/gh/telus/create-library
[circle-image]: https://img.shields.io/circleci/project/github/telus/create-library/master.svg?style=for-the-badge&logo=circleci

[npm-url]: https://www.npmjs.com/package/@telus/create-library
[npm-image]: https://img.shields.io/npm/v/@telus/create-library.svg?style=for-the-badge&logo=npm

[probot-settings]: https://github.com/probot/settings
[semantic-release]: https://github.com/semantic-release/semantic-release
[tap]: https://github.com/tapjs/node-tap
[npm-audit]: https://docs.npmjs.com/cli/audit
[updated]: https://github.com/ahmadnassri/node-updated
[editorconfig]: https://github.com/editorconfig-checker/editorconfig-checker.javascript
[eslint]: https://github.com/eslint/eslint
[remark-cli]: https://github.com/remarkjs/remark/tree/master/packages/remark-cli
[renovate]: https://github.com/renovatebot/renovate
[telus/eslint-config]: https://github.com/telus/eslint-config
[telus/remark-config]: https://github.com/telus/remark-config
[telus/semantic-release-config]: https://github.com/telus/semantic-release-config
[github-licenses]: https://help.github.com/articles/licensing-a-repository/
[npm-init]: https://docs.npmjs.com/cli/init#description
[ast-confluence]: https://telusdigital.atlassian.net/wiki/spaces/AST/overview
