![npm](https://img.shields.io/npm/v/scaffold-react-component)

# scaffold-react-component

Scaffold a React component with styles, tests and a story.

This tool is reasonably opionated and assumes you are using:

* React
* SCSS modules
* Jest (unit tests)
* Storybook (document components) 

Feel free to fork and modify if you're using something else.

## Installation
It's recommend to install this globally, so it's available across all projects.

`npm install -g scaffold-react-component`

## Usage

For full guidance run:

`scaffold --help`

To scaffold a functional React component use, e.g.

`scaffold Modal`

To scaffold a ES6 class React component use the second argument, or the `--type`/`-t` parameter.

* `scaffold Modal class`
* `scaffold Modal --type class`
* `scaffold Modal -t class`

By default, the Storybook category will be set to 'Common', you can override this with the `--storybookCategory`/`-sb` parameter.

* `scaffold Modal -storybookCategory UI`
* `scaffold Modal -sb UI`

### Directory Creation

By default `scaffold` will create the directory for the component if needed. It will skip this step if:

* the directory already exists, and it is empty
* the current working directory matches the intended name, and it is empty

## Publishing a new version of this package
Make sure you have `np` installed globally: 

`npm install -g np`.

Run `np` and follow the instructions to publish the new package.

## Contributing

Please feel free to raise any issues you come across, and we welcome any pull requests!

### Contributors

* [clarkd](https://github.com/clarkd)