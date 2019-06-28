workflow "Build, test, lint, release" {
  on = "push"
  resolves = ["semantic-release"]
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

action "semantic-release dryrun" {
  needs = [
    "npm run lint",
    "npm run test"
  ]
  uses = "actions/npm@master"
  args = "run release:dryrun"
  secrets = ["GH_TOKEN", "NPM_TOKEN"]
}

# Filter for master branch
action "master branch only" {
  needs = [
    "semantic-release dryrun"
  ]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "semantic-release" {
  needs = [
    "master branch only"
  ]
  uses = "actions/npm@master"
  args = "run release"
  secrets = ["GH_TOKEN", "NPM_TOKEN"]
}
