reveal-cli
======================================================================

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/sezalcru/reveal-cli.svg?branch=master)](https://travis-ci.org/sezalcru/reveal-cli)
[![Coverage Status](https://coveralls.io/repos/github/sezalcru/reveal-cli/badge.svg?branch=master)](https://coveralls.io/github/sezalcru/reveal-cli?branch=master)

Features
======================================================================

- Generate base project structure based on blueprints
- Deploy slides to GitHub Projects

Installation
======================================================================

```
$ npm install -g reveal-cli
```

Usage
======================================================================

Typing the `reveal` command will bring up the available options and their requirements.

### Generate a project

```
$ reveal new <project-name>
```

### Deploy to GitHub Pages

```
$ cd path/to/project
$ reveal deploy
```

_Note:_ Requires a .git repo with a valid GitHub remote

License
======================================================================

MIT License

Copyright (c) 2016 César Cruz
