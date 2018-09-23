# Universal Paperclips Mirror
This is a mirror of the incremental clicker game [Universal Paperclips](http://www.decisionproblem.com/paperclips/) created by [Frank Lantz](https://en.wikipedia.org/wiki/Frank_Lantz) in 2017 to help him learn Javascript. In Universal Paperclips you take the role of an AI which produces and sells paperclips, the goal of the game is to make as many paperclips as possible... Even if this requires the eradication of the human race to maximise paperclip production.

Universal Paperclips is a strangely addictive game! I wanted to make this mirror so that I could always play it even if the original version was taken down. The game is written in Javascript using HTML inputs to interact with it.

## Building
The original version of Paperclips was hosted in an Apache web server, this mirror instead uses a simple NodeJS HTTP server. To run the server you must first install the dependencies using NPM, you can do this by typing the following command into the terminal when you are in the root directory of this repository;

> `npm install`

Once the dependencies have been installed you can run the server by typing the following command in the terminal;

> `npm start`

This will start the HTTP server allowing you to play the game in your web browser at the address [localhost:1234](http://localhost:1234). When you are finished with the server you can press CTRL+C while in the terminal to stop the server.

## Documentation
The following pages contain technical information about how Universal Paperclips works. These are useful if you want to modify any parts of the game.

- [Persistence](docs/persistence.md)

## Change Log
This mirrored version of Universal Paperclips has been modified in the following ways;

- Refactored saving and loading to have less duplicated code
- Dynamically show and hide debug buttons when `debug()` function called
- Google Analytics has been removed
- The Android and IOS app adverts have been removed
- The gift shop div has been removed

## License
This software is unlicensed, it is a clone of Universal Paperclips by Frank Lantz. I could not find any copyright notices on the original software and do not know what the original license is. This is not to be distributed and is my own private repository with the goal of preserving and potentially improving this fantastic game.
