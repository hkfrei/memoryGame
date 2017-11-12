# MEMORY GAME

A classic Memory Game. 🃏 Find the matching cards. 🃏

## Getting Started

You can get a local copy of the project by running this command on your console:
```
git clone https://github.com/hkfrei/memoryGame.git
```
After that, you should have a new directory named "memoryGame". Enter it by typing...
`cd memoryGame`.


### Prerequisites

The project needs the package manager [Node](https://nodejs.org/en/). You can install it from [here](https://nodejs.org/en/)


### Installing

While in the newly created folder, install all the dependencies.
```zsh
npm install
```

After that, you can start a development server. If you have PHP installed you can type...
```zsh
php -S localhost:8000
```
Open your Browser at `http://localhost:8000` and you are ready to go.

### Instructions
If you click on a card, it show's it's Symbol. The goal of the game is to open two cards in a row with the same symbol. If the Symbols do not match, the Cards close and you have to memory the symbol in your head for a later try. Do so, until all cards are opened. On the first card click a timer starts. It stops, when are cards are opened. The faster you are and the less moves you need, the better the result. 🥇


## Running the tests

This project uses eslint to test coding style. You can see the current configuration in *.eslintrc.js*.
What's special about the current config, is that the UDACITY style checker is installed. Currently *app.js* is beeing linted.
Please refer to [https://www.npmjs.com/package/eslint-config-udacity](https://www.npmjs.com/package/eslint-config-udacity) for installation instructions.
You can run tests with...

```
npm run lint
```
Don't forget, you need to be in the *root* directory to run this command successfully.

## Built With

* [NODE](https://nodejs.org/en/) - Package Management
* [UDACITY](https://github.com/udacity/fend-project-memory-game) - Starting Template for the Project.
* [Material Design Components](https://github.com/material-components/material-components-web) layout elements (css and javascript).

## Contributing

Of course, this project can be extended.
Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/hkfrei/memoryGame/tags).

## Authors

* **Hanskaspar Frei**

See also the list of [contributors](https://github.com/hkfrei/memoryGame/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
* [UDACITY](https://www.udacity.com) for the starter Project.
