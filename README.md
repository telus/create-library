![maintenance-status](https://img.shields.io/badge/maintenance-passively--maintained-yellowgreen.svg)
![npm (scoped)](https://img.shields.io/npm/v/@telus/create-library)


# NPM Library Initializer

An opinionated [npm package initializer](https://docs.npmjs.com/cli/init#description). Scaffolds an npm library tree with fully configured CI automation, using a predefined [template](./template).

Use this to easily scaffold an NPM package for use within TELUS.

- [Why and when should I use this?](#step-0)
- [Requirements](#step-1)
- [What's included](#step-2)
- [Usage](#step-3)
- [Frequently Asked Questions](#step-4)
- [Additional guides](#step-5)

## <a id="step-0"></a> Why and when should I use this?

This starter kit is opinionated, and it is meant to encourage a good set of practices, but it is also flexible from a configuration point of view. We encourage teams to use the tools we have included in the template for setting up a solid and reliable pipeline that will allow for a good developer workflow and collaboration process. You are free to remove and/or add additional jobs or steps in your pipeline if that makes sense for your project and team.

Here are some of the principles and concepts we have based this on:

- We use Git _feature branches_, which allow us to isolate the development work and instantly get feedback as to how the changes impact the unit tests and lint checks (using Github actions and integrated status checks).
- We believe in _the power of automation_, which is why we have opted for automated semantic versioning and releasing using [semantic-release](https://github.com/semantic-release/semantic-release). The template pipeline is configured to only run the `release` step on the `master` branch, which is why it is vital that only good code gets pushed to it.
- Given this, we encourage implementing _branch protection for the `master` branch_ and merging changes into it following a pull request process, with at least one approval required. Having the unit tests and lint checks run in the CI pipeline automatically allows the PR reviewers to focus on the actual code changes, without having to always pull the respective branch locally to confirm no issues are introduced.
- Automation of the package release workflow is made possible by following _formalized git commit conventions_, more specifically [conventional-commit-conventions](https://www.conventionalcommits.org/en/v1.0.0/). This removes the immediate connection between human emotions and version numbers, strictly following the Semantic Versioning specs. Please refer to our [semantic-release][guides-semantic-release] guide for more details about how this works.
- We are fans of _configuration as code_, which is why we are taking advantage of Github's [Probot](https://github.com/probot/settings) framework to store the repository settings as [code](./.github/settings.yml). Please review these and configure as needed. We encourage the practice of squashing commits and keeping a clean commit history (without standard merge commits cluttering the history). If squashing commits is a practice your team chooses to use, you will have the responsibility to ensure that the squashed commit message follows the Angular commit conventions and captures all included changes correctly.
- We believe there is a lot of value in having _consistent code style_ across all of our projects, which is why we have centralized the configuration of our code quality and style checking tools in external libraries, such as [@telus/telus-standard](https://github.com/telus/telus-standard), [@telus/remark-config](https://github.com/telus/remark-config), etc. We encourage teams to use our centralized config packages and not override particular rules; our configuration is open to suggestions to contributions (feel free to add issues and/or open PRs in the repositories of the above mentioned packages).
- We believe in automation and in _leveraging automated code formatters_ such as [prettier](https://prettier.io/). The scaffolded library will be configured out of the box to automatically format all the staged files when the user commits. For that, we are using [husky](https://github.com/typicode/husky) to configure the pre-commit hook and restrict the formatting to the staged files that are part of the commit.

## <a id="step-1"></a> Requirements

- `npm >= 6.x`
- `node >= 14.*`

## <a id="step-2"></a> What's included?

This NPM library initializer is a CLI tool that makes the process of creating and publishing a new NPM package significantly easier and faster. Here's what you get out of the box:

- Scaffolded NPM library, with automatically generated `package.json` and Github settings based on user input
- Github Actions for a standard workflow, including installing dependencies, testing, linting, and automated releases
- Automated version management and NPM package publishing using [semantic-release](https://github.com/semantic-release/semantic-release), that uses formalized commit message convention to document changes in the codebase
- Basic setup for unit tests with [tap](https://github.com/tapjs/node-tap)
- Security auditing using [npm audit](https://docs.npmjs.com/cli/audit)
- `.editorconfig` linting using [editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker.javascript)
- Javascript linting using [telus-standard](https://github.com/telus/telus-standard), and a command to automatically fix most small issues
- Automated dependency updates using Dependabot
- Github repository settings as code living in the repository of your library (see [probot/settings][probot-settings] for more details)

Some of the tools mentioned above rely on centralized configuration files, that allow us to achieve consistency across all of the applications built by our team, and remove duplicated configs across all of our repositories. You are welcome to open a PR in either of these if you would like to suggest any changes:

- `telus-standard` (Javascript linting with our own flavour of StandardJS) - see [@telus/telus-standard](https://github.com/telus/telus-standard)
- `remark` (Markdown linting) - see [@telus/remark-config](https://github.com/telus/remark-config)

## <a id="step-3"></a> Usage

```bash
mkdir my-new-project
cd my-new-project
npm init @telus/library
git init
npm install
```

or (automatically creates directory)

```bash
npm init @telus/library my-new-project
cd my-new-project
git init
npm install
```

When you run `npm init @telus/library`, you will be prompted with a few questions. Here's what you need to know to be ready:

- if your project will be open source (Y/N)
- project title
- project description
- repository name
- license type (read more about [license types](https://help.github.com/articles/licensing-a-repository/))
- keywords
- maintainers (Github team slug)

### What's this `npm init` magic?

The `npm init` command was solely used to create a new `package.json` file. As of npm v6.1.0, `npm init` can be used as an initializer by passing the name of the package you want initialized after `npm init`; npm will prepend `create-` to the name of the initializer you provide and use `npx` to temporarily install and execute that project. You can read more about this [here](https://docs.npmjs.com/cli/init#description).

As a result, this is what happens after you run `npm init @telus/library`:

- The command `npm init @telus/library` gets transformed and run as `npx @telus/create-library`, which will install and execute the current package.
- Executing this package means running [index.js](./index.js), which starts the CLI and collects all of your answers.
- As soon as all answers are collected and minimally processed, they are used to populate placeholders (see [template.js](./lib/template.js)) in the files located inside the `template` folder.
- The entire contents of the `template` folder (with the placeholders filled with your info) gets copied in the location where the command was run.
- Now you can start working on your library!

## <a id="step-4"></a> Frequently Asked Questions

### 1. How do I migrate existing libraries?

If you are thinking of bringing these updates into an existing NPM library, and don't know where to start, here are a few tips on how you could approach this:

- Create a new branch in your project.
- While on your newly created branch, inside the main folder of your application, run `npm init @telus/library`.
- You'll probably notice that this will create a few new files, and also modify some existing ones.
- Use your IDE or any diffing tool to walk through the changes and remove any unnecessary files.
- Pay special attention to `package.json` and your `README` files, as these will be completely replaced; however, you'll want to merge what you had in there before with what gets generated.
- If you run into any issues, reach out to the [Architecture Support Team](https://telusdigital.atlassian.net/wiki/spaces/AST/overview).

### 2. How do I keep up with the updates?

Just run `npm init @telus/library` inside your root folder just like you did it the first time, and then review the diff to see what has changed and reconcile the changes with your existing code.

### 3. What if I have source and distribution files?

Configure `babel` and your build script(s) as needed. Then consider the following for a good setup:

- Review the `package.json` `files` section and specify what files you would like included when your package is installed as a dependency. You can publish both your `src` and `lib` (or `dist`) if you would like your package consumers to be able to access the source code, or you can opt to [only publish the distribution files](https://docs.npmjs.com/files/package.json#files) (transpiled code). Feel free to add an `.npmignore` file if needed.
- Consider adding a `prepare` or `prepublishOnly` script to automate building & updating the distribution files. You can read more about these if you run `npm help scripts`.
- Consider adding your `lib`/`dist` folder to the `.gitignore`, especially if you automate the creation of these assets. It makes sense for only source files to be committed in the repository, especially as transpiled code is often hard to read (there have been incidents where malicious code has been included on purpose within the transpiled code and made it into published packages).

### 4. Why does my pipeline keep failing?

Probably because the `lint` job fails! There are a few kinds of linting we have included with this template, and you should expect some of these to occasionally fail even if you didn't make any changes to the code. Here's why:

- We are linting for security vulnerabilities using `npm audit`. The dependencies you use might be ok today, but not tomorrow if a security issue is discovered!

### 5. Why doesn't the version inside `package.json` get updated?

Long gone are the days when you had to do semantic versioning manually! With `semantic-release`, the type of release required gets determined automatically based on your git commits, and with that you also get git tags and releases created automatically in your repository. `semantic-release` will take control of your `package.json` `version` field, which will get updated before publishing to the NPM registry, however the update won't be also pushed to Github.

We recommend leaving the version as is at initialization: `"version": "0.0.0-development"`. Your NPM library consumers are encouraged to refer to the Github releases tab inside your repository or to the NPM registry page for info about published versions.

## <a id="step-5"></a> Additional guides

Before you start using this initializer and the tools inside it, **please make sure you familiarize yourself with `Github Actions` and `semantic-release`**. For more information about how these work and how they were configured, please refer to the documentation below:

- [GitHub Actions](https://developer.github.com/actions/)
- [Semantic Release](https://github.com/telus/guides/blob/master/semantic-release.md)

---

> Github: [@telus](https://github.com/telus) &bull;
> Twitter: [@telusdigital](https://twitter.com/telusdigital)
