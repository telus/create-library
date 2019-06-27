# NPM Library Initializer

[![version][npm-image]][npm-url] [![Build Status][circle-image]][circle-url]

An opinionated [npm package initializer][npm-init]. Scaffolds an npm library tree with fully configured CI automation, using a predefined [template](./template).

Use this to easily scaffold an NPM package for use within TELUS.

- [Why and when should I use this?](#step-0)
- [Requirements](#step-1)
- [What's included](#step-2)
- [Usage](#step-3)
- [Local development gotchas](#step-4)
- [Frequently Asked Questions](#step-5)
- [Additional guides](#step-6)

## <a id="step-0"></a> Why and when should I use this?

The present NPM library initializer was created as a replacement to [npm-library-starter-kit][npm-library-starter-kit] and as part of our effort to migrate our projects to use [CircleCI][guides-circle-ci]. This starter kit is opinionated, and it is meant to encourage a good set of practices, but it is also flexible from a configuration point of view. We encourage teams to use the tools we have included in the template for setting up a solid and reliable pipeline that will allow for a good developer workflow and collaboration process. You are free to remove and/or add additional jobs or steps in your pipeline if that makes sense for your project and team.

Here are some of the principles and concepts we have based this on:

- We use Git _feature branches_, which allow us to isolate the development work and instantly get feedback as to how the changes impact the the unit tests and lint checks (using CircleCI and Github integrated status checks).
- We believe in _the power of automation_, which is why we have opted for automated semantic versioning and releasing using [semantic-release][semantic-release]. The template pipeline is configured to only run the `release` step on the `master` branch, which is why it is vital that only good code gets pushed to it.
- Given this, we encourage implementing _branch protection for the `master` branch_ and merging changes into it following a pull request process, with at least one approval required. Having the unit tests and lint checks run in the CI pipeline automatically allows the PR reviewers to focus on the actual code changes, without having to always pull the respective branch locally to confirm no issues are introduced.
- Automation of the package release workflow is made possible by following _formalized git commit conventions_, more specifically [angular-commit-conventions][angular-commit-conventions]. This removes the immediate connection between human emotions and version numbers, strictly following the Semantic Versioning specs. Please refer to our [semantic-release][guides-semantic-release] guide for more details about how this works.
- We are fans of _configuration as code_, which is why we are taking advantage of Github's [Probot][probot-settings] framework to store the repository settings as [code](./.github/settings.yml). Please review these and configure as needed. We encourage the practice of squashing commits and keeping a clean commit history (without standard merge commits cluttering the history). If squashing commits is a practice your team chooses to use, you will have the responsibility to ensure that the squashed commit message follows the Angular commit conventions and captures all included changes correctly.
- We believe there is a lot of value in having _consistent code style_ across all of our projects, which is why we have centralized the configuration of our code quality and style checking tools in external libraries, such as [@telus/telus-standard][telus/telus-standard], [@telus/remark-config][telus/remark-config], etc. We encourage teams to use our centralized config packages and not override particular rules; our configuration is open to suggestions to contributions (feel free to add issues and/or open PRs in the repositories of the above mentioned packages).
- We believe in automation and in _leveraging automated code formatters_ such as [prettier][prettier]. The scaffolded library will be configured out of the box to automatically format all the staged files when the user commits. For that, we are using [husky][husky] and [lint-staged][lint-staged] to configure the pre-commit hook and restrict the formatting to the staged files that are part of the commit.
- We believe in _simplification and noise reduction_. For this reason, we have configured the CI pipeline to have access to these common tools (linting, releasing, etc.) and their associated centralized configs, and have consciously omitted those from the list of dependencies in `package.json`. If you would like to be able to run the CI jobs locally (unit tests, linting, etc.), you will have to have these peer dependencies installed. Please refer to [Local development gotchas](#step-4) for more details.

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

- `telus-standard` (Javascript linting with our own flavour of StandardJS) - see [@telus/telus-standard][telus/telus-standard]
- `remark` (Markdown linting) - see [@telus/remark-config][telus/remark-config]
- `semantic-release` (automated version management and NPM publishing) - see [@telus/semantic-release-config][telus/semantic-release-config]

## <a id="step-3"></a> Usage

```bash
mkdir my-new-project
cd my-new-project
npm init @telus/library
```

When you run `npm init @telus/library`, you will be prompted with a few questions. Here's what you need to know to be ready:

- if your project will be open source (Y/N)
- project title
- project description
- repository name
- license type (read more about license types [here][github-licenses])
- keywords
- maintainers (Github team slug)

Once you have scaffolded you library files and pushed them to a repository, you can set up your new repository with CircleCI so that it runs the configured pipeline for every push.

To do that, go to [Circle CI][circle-ci-telus] and login with your Github account. Once logged in, you should be able to access the `Add projects` page, where you can search for your repository and click on `Set Up project`. In the next step, CircleCI will try to determine what OS and language your app needs (Linux/Node should be correct for most of our apps) and suggest you how to write your configuration file. Remember we already have [that](./template/circle.yml) among our scaffolded files, so just click on `Start building`.

Once you have clicked on `Start building`, CircleCI will try to identify your config file and run the pipeline accordingly in your `master` branch. If no config file is found in the `master` branch, you'll see an error. However, once you make a new push to any branch and a valid config file is detected, you will see the pipeline run.

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

In order to make these scripts work in local development, you will need to ensure you have those packages installed on your machine. Running `npx install-group peer --package @telus/build-essential --no-save` inside your project folder will make those dependencies available. For convenience, we have added a script for this inside the template `package.json`: `npm run setup-local`. This will add these packages to your local `node_modules`, however keep in mind that you will have to do this again every time you reset your `node_modules` folder (that happens when you run `npm install`).

## <a id="step-5"></a> Frequently Asked Questions

### 1. How do I migrate existing libraries?

If you are thinking of bringing these updates into an existing NPM library, and don't know where to start, here are a few tips on how you could approach this:

- Create a new branch in your project.
- While on your newly created branch, inside the main folder of your application, run `npm init @telus/library`.
- You'll probably notice that this will create a few new files, and also modify some existing ones.
- Use your IDE or any diffing tool to walk through the changes and remove any unnecessary files.
- Pay special attention to `package.json` and your `README` files, as these will be completely replaced; however, you'll want to merge what you had in there before with what gets generated.
- If you run into any issues, reach out to the [Architecture Support Team][ast-confluence].

### 2. How do I keep up with the updates?

Just run `npm init @telus/library` inside your root folder just like you did it the first time, and then review the diff to see what has changed and reconcile the changes with your existing code.

### 3. What if I have source and distribution files?

Configure `babel` and your build script(s) as needed. Then consider the following for a good setup:

- Review the `package.json` `files` section and specify what files you would like included when your package is installed as a dependency. You can publish both your `src` and `lib` (or `dist`) if you would like your package consumers to be able to access the source code, or you can opt to only publish the distribution files (transpiled code). See more details about how this works [here][npm-files]. Feel free to add an `.npmignore` file if needed.
- Consider adding a `prepare` or `prepublishOnly` script to automate building & updating the distribution files. You can read more about these if you run `npm help scripts`.
- Consider adding your `lib`/`dist` folder to the `.gitignore`, especially if you automate the creation of these assets. It makes sense for only source files to be committed in the repository, especially as transpiled code is often hard to read (there have been incidents where malicious code has been included on purpose within the transpiled code and made it into published packages).

### 4. Why does my pipeline keep failing?

Probably because the `lint` job fails! There are a few kinds of linting we have included with this template, and you should expect some of these to occasionally fail even if you didn't make any changes to the code. Here's why:

- We are linting for security vulnerabilities using `npm audit`. The dependencies you use might be ok today, but not tomorrow if a security issue is discovered!
- We are linting for outdated dependencies, because we believe this will encourage our devs to keep their apps dependencies up-to-date! The more dependencies you have, the higher the likelihood for those to be updated and hence cause your pipeline to fail. Refer to the [updated][updated] docs for more details and usage options.

### 5. Why doesn't the version inside `package.json` get updated?

Long gone are the days when you had to do semantic versioning manually! With `semantic-release`, the type of release required gets determined automatically based on your git commits, and with that you also get git tags and releases created automatically in your repository. `semantic-release` will take control of your `package.json` `version` field, which will get updated before publishing to the NPM registry, however the update won't be also pushed to Github.

We recommend leaving the version as is at initialization: `"version": "0.0.0-development"`. Your NPM library consumers are encouraged to refer to the Github releases tab inside your repository or to the NPM registry page for info about published versions.

### 6. Can I get Slack notifications when my library's pipeline?

But of course! Have a look at this [guide][circleci-slack] for instructions on how to set up CircleCI integration with Slack.

### 7. I keep getting errors on my local when I run `npm run lint`

Example: `Error: Cannot find module '@telus/remark-config'`.

You probably missed the part where we talked about our centralized config packages. Have a look at [Local development gotchas](#step-4).

## <a id="step-6"></a> Additional guides

Before you start using this initializer and the tools inside it, **please make sure you familiarize yourself with `CircleCI` and `semantic-release`**. For more information about how these work and how they were configured, please refer to the documentation below:

- [CircleCI][guides-circle-ci]
- [semantic-release][guides-semantic-release]

---

> Github: [@telus](https://github.com/telus) &bull;
> Twitter: [@telusdigital](https://twitter.com/telusdigital)

[circle-url]: https://circleci.com/gh/telus/create-library
[circle-image]: https://img.shields.io/circleci/project/github/telus/create-library/master.svg?style=for-the-badge&logo=circleci
[npm-url]: https://www.npmjs.com/package/@telus/create-library
[npm-image]: https://img.shields.io/npm/v/@telus/create-library.svg?style=for-the-badge&logo=npm
[npm-library-starter-kit]: https://github.com/telus/npm-library-starter-kit
[angular-commit-conventions]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines
[probot-settings]: https://github.com/probot/settings
[semantic-release]: https://github.com/semantic-release/semantic-release
[tap]: https://github.com/tapjs/node-tap
[npm-audit]: https://docs.npmjs.com/cli/audit
[updated]: https://github.com/ahmadnassri/node-updated
[editorconfig]: https://github.com/editorconfig-checker/editorconfig-checker.javascript
[eslint]: https://github.com/eslint/eslint
[remark-cli]: https://github.com/remarkjs/remark/tree/master/packages/remark-cli
[renovate]: https://github.com/renovatebot/renovate
[telus/telus-standard]: https://github.com/telus/telus-standard
[telus/remark-config]: https://github.com/telus/remark-config
[prettier]: https://prettier.io/
[husky]: https://github.com/typicode/husky
[lint-staged]: https://github.com/okonet/lint-staged
[telus/semantic-release-config]: https://github.com/telus/semantic-release-config
[github-licenses]: https://help.github.com/articles/licensing-a-repository/
[circle-ci-telus]: https://circleci.com/add-projects/gh/telus
[npm-init]: https://docs.npmjs.com/cli/init#description
[ast-confluence]: https://telusdigital.atlassian.net/wiki/spaces/AST/overview
[npm-files]: https://docs.npmjs.com/files/package.json#files
[circleci-slack]: https://circleci.com/blog/slack-integration/
[guides-circle-ci]: https://github.com/telus/guides/blob/master/circle-ci.md
[guides-semantic-release]: https://github.com/telus/guides/blob/master/semantic-release.md
