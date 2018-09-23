# Universal Paperclips Mirror
This is a mirror of the incremental clicker game [Universal Paperclips](http://www.decisionproblem.com/paperclips/) created by [Frank Lantz](https://en.wikipedia.org/wiki/Frank_Lantz) in 2017 to help him learn Javascript. In Universal Paperclips you take the role of an AI which produces and sells paperclips, the goal of the game is to make as many paperclips as possible... Even if this requires the eradication of the human race to maximise paperclip production.

Universal Paperclips is a strangely addictive game! I wanted to make this mirror so that I could always play it even if the original version was taken down. The game is written in Javascript using HTML inputs to interact with it. This mirrored version has been modified in the following ways;

- Google Analytics has been removed
- The Android and IOS app adverts have been removed
- The gift shop div has been removed

## Building
The original version of Paperclips was hosted in an Apache web server, this mirror instead uses the [Parcel](https://parceljs.org/) web bundler to setup a local development server. An NPM `package.json` file has been included within this mirror to hold build scripts and dependencies. Before you run the server you must install the dependencies with the following command;

> `npm install`

Once the dependencies have been installed you can run the following command to start the server;

> `npm start`

Once the server is running you can play the game in your browser by going to [http://localhost:1234](http://localhost:1234). When you are finished using the server you can press Control + C within the terminal running the server to stop it.
