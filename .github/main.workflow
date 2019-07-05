workflow "Build, test, lint, release" {
  on = "push"
  resolves = ["npm run release"]
}

action "npm ci" {
  uses = "actions/npm@master"
  args = "ci"
}

action "npm run lint" {
  needs = "npm ci"
  uses = "actions/npm@master"
  args = "run lint"
}

action "npm run test" {
  needs = "npm ci"
  uses = "actions/npm@master"
  args = "run test"
}

action "npm run release:dryrun" {
  needs = [
    "npm run lint",
    "npm run test"
  ]
  uses = "actions/npm@master"
  args = "run release:dryrun"
  secrets = ["GITHUB_TOKEN", "NPM_TOKEN"]
}

# Filter for master branch
action "master branch only" {
  needs = [
    "npm run release:dryrun"
  ]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "npm run release" {
  needs = [
    "master branch only"
  ]
  uses = "actions/npm@master"
  args = "run release"
  secrets = ["GITHUB_TOKEN", "NPM_TOKEN"]
}
