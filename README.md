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
reveal new <file-name>
```

Where file-name would be your desired project filename. By default, this command generates a simple revealjs slide deck, to enable a full slide deck use the `--full` flag. This will also install all NPM and Bower dependencies.

Missing:
- Testing
- Option to generate git repository
