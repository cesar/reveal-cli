reveal-cli
======================================================================

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Features
======================================================================

- Generate base project structure based on blueprints
- ~~Export slides to PDF~~
- ~~Deploy slides using strategies (e.g. Deploy to GitHub Pages)~~
- ~~Import plugins~~

Installation
======================================================================

```
npm install -g reveal-cli
```

Usage
======================================================================

Typing the `reveal` command will bring up the available options and their requirements.

### Generate a project

```
reveal new <project-name>
```

Where file-name would be your desired project filename. By default, this command generates a [basic Revealjs setup](https://github.com/hakimel/reveal.js/#basic-setup), to enable a full setup use the `--full` flag when using the `new` command. Generating a full setup will also install all NPM and Bower dependencies. Passing the `--git` option initializes a git repository and [gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore) file inside the project folder.

```
reveal new <project-name> --full
```

License
======================================================================

MIT License

Copyright (c) 2016 César Cruz
