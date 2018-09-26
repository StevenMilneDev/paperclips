# Universal Paperclips
## General
This page contains general information about the way Paperclips works.

### Game Loop
Paperclips uses two game loops to drive it's logic, both of them using `setInterval` with different intervals. There is the main game loop which runs every 10ms, the bulk of the logic in the game happens in this loop. The other loop is the slow loop which runs every 100ms and calculates things like wire price fluctuation, paperclip sales and revenue and is also used to auto-save the game.

The game seems to consume a fair amount of battery power while running both in the web and on Android, this is likely due to the fact that the bulk of the games work is done in the fast loop. Some things could be moved out of the fast loop and into the slow loop without compromising speed of progress in the game. The project management subsystem is one such component which has already been moved to the slow loop due its DOM manipulation making it costly to repeatedly call.

The main loop also updates the DOM with all of the current values. This is a lot of elements whose `innerHTML` is being changed. We could get a decent performance improvement if the DOM manipulation was done in animation frames.

#### Other Loops
There are also a small collection of other more specific game loops. Below is a list of other loops and what they do;

- Stock List Display Loop (runs every 100ms)
- Stock Purchasing Loop (runs every 1000ms)
- Stock Selling Loop (runs every 2500ms)
- Strategy Picker Loop (runs every 100ms)

~~These could be consolidated into two game loops the slow and fast ones. The strategy picker loop could be changed to an event listener instead of polling the element for change.~~ **EDIT: The game loop has been refactored to make use of the GameLoop class which provides a slow loop, fast loop and a render loop. All tasks within the various game loops have been refactored into one of these pipelines**

### The New Game Loop
The `GameLoop` class has been added to the game, this class orchestrates the games logic against three loops. The game loop operates three loops which are invoked repeatedly at different times. The slow loop is invoked every 100ms, the fast loop is invoked every 10ms and the render loop is invoked every time the browser is about to paint the window. Callers can register to be invoked on any of these loops by calling the `register()` method which takes a callback function which will be called every time the loop is invoked.

The game already had a fast and slow loop (among others) but it did not have a render loop. The render loop is special as it uses `requestAnimationFrame()` to hook into the browsers rendering system. This loop will be invoked just before the browser is about to repaint and reflow the window. Putting tasks which affect the DOM here should help prevent the browser from being forced to reflow between frames. This loop will typically be called at the display devices natural refresh rate, typically at a rate of 60Hz.  This loop is not invoked when the browser or tab does not have focus or isn't visible on the screen, this should also help improve battery life on devices playing the game.

This class should help orchestrate the many tasks that need to be performed by the game. It should also help improve the performance of the game as DOM related tasks can be moved into the render loop. The class exposes another set of methods `onSlow()`, `onFast()` and `onRender` which can be used to setup multiple callbacks at once. There are various methods within [pipeline-methods.js](../public/pipeline-methods.js) which help you ensure the callback is only called on the loop when certain criteria are met. Below is an example game loop using this class;

```javascript
var game = new GameLoop();

game.onFast([
  calculateClipCount,
  withHumans(chain([
    calculateClipSales,
    manageStocksAndShares
  ]))
]);

game.start();
```

The example above sets up a new game loop and adds callbacks to the fast game loop to be called every 10ms. The `onX()` methods take an array of functions as arguments. In the example the `calculateClipCount` function will get called every 10ms, however the functions `calculateClipSales` and `manageStocksAndShares` will ONLY get called every 10ms if there are still humans. The `withHumans()` function takes a function and returns a new function which when called will only call the given function if `humanFlag == 0`. The `chain()` function works much the same only it takes an array of functions and when it's called it will call each function in the array.

The new game loop lives in [main.js](../public/main.js) and everything else has been moved out into [logic.js](../public/logic.js).
