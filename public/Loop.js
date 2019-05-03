(function () {

  function extendClass(subclass, superclass) {
    Object.setPrototypeOf(subclass.prototype, superclass.prototype);
    Object.setPrototypeOf(subclass, superclass);
  }

  const State = Object.freeze({
    STOPPED: 'STOPPED',
    RUNNING: 'RUNNING'
  });

  /**
   * @class Loop
   */
  function Loop(config) {
    this.config = config || {};

    this.applyDefaults();

    this.pipeline = [];
    this.state = State.STOPPED;

    this.timings = [];
  }

  /**
   * @static
   * @readonly
   * @prop {Object} State An enum which contains the various states that the
   * loop can be in.
   */
  Loop.State = State;

  /**
   * Starts the loop running at the specified interval.
   */
  Loop.prototype.start = function start() {
    if (this.state === State.RUNNING) return;

    this.doStart();

    this.state = State.RUNNING;
  };

  /**
   * Stops the loop from running.
   */
  Loop.prototype.stop = function stop() {
    if (this.state === State.STOPPED) return;

    this.doStop();

    this.state = State.STOPPED;
  };

  /**
   * Stops and then starts the loop running. This will start the loop if it was
   * not previously running.
   */
  Loop.prototype.restart = function restart() {
    this.stop();
    this.start();
  };

  /**
   * Adds callbacks to the loop pipeline. All callbacks registered through this
   * method will be invoked every time the loop is invoked.
   * @param {Function|Function[]} callbacks The callbacks to be added to the pipeline
   */
  Loop.prototype.add = function add(callbacks) {
    if (typeof callbacks === 'function') {
      this.pipeline.push(callbacks);
      return;
    }

    this.pipeline.push.apply(this.pipeline, callbacks);
  };

  /**
   * Sets the interval that the loops runs at. If no speed is specified or if the
   * speed is zero or nagative then the default speed is set. If the loop was
   * running when this command was called then it will be restarted to apply the
   * changes. The interval is measured in milliseconds.
   * @param {Number} speed The number of milliseconds between loop iterations
   */
  Loop.prototype.setSpeed = function setSpeed(speed) {
    if (speed === this.speed) return;

    this.speed = (speed || 0) <= 0 ? this.getDefaultSpeed() : speed;

    if (this.state === State.RUNNING) this.restart();
  };

  /**
   * Returns the current speed that the loop is running at in millisecond
   * intervals.
   * @return {Number} The number of milliseconds between loop iterations
   */
  Loop.prototype.getSpeed = function getSpeed() {
    return this.speed;
  };

  /**
   * Returns the speed that this loop was originally set up at.
   * @return {Number} The initial speed of the loop
   */
  Loop.prototype.getDefaultSpeed = function getDefaultSpeed() {
    return this.config.speed || 100;
  };

  /**
   * Returns the current state of the loop.
   * @return {Loop.State} The current state
   */
  Loop.prototype.getState = function getState() {
    return this.state;
  };

  /**
   * Calculates the average time taken for this loop to execute it's pipeline.
   * The average is taken over the last 1000 iterations.
   * @return {Number} The average amount of milliseconds taken to invoke this loop
   */
  Loop.prototype.getAverageTime = function getAverageTime() {
    let total = 0;
    for(let time of this.timings) {
      total += time;
    }

    return total / this.timings.length;
  };

  /**
   * @protected
   * This method is responsible for actually scheduling the loop to start and
   * setting an iteration ID.
   */
  Loop.prototype.doStart = function doStart() {
    this.id = setInterval(this.run.bind(this), this.speed);
  }

  /**
   * @protected
   * This method is responsible for stopping the loop from running and clearing
   * the iteration ID.
   */
  Loop.prototype.doStop = function doStop() {
    clearInterval(this.id);
    this.id = null;
  }

  /**
   * @protected
   * This method is the entry point of the loop and should be executed every
   * cycle. It will execute each of the functions in the loop pipeline in turn.
   */
  Loop.prototype.run = function run() {
    this.doRun();
  }

  /**
   * @protected
   * Invokes the loops pipeline.
   */
  Loop.prototype.doRun = function doRun() {
    let start = performance.now();

    this.pipeline.map(function (fn) {
      try {
        fn();
      } catch(e) {
        console.error(e);
      }
    });

    let end = performance.now();
    this.logDuration(end - start);
  }

  /**
   * @private
   * Logs the amount of time in milliseconds taken to execute the entire
   * pipeline.
   * @param {Number} duration The number of milliseconds taken
   */
  Loop.prototype.logDuration = function logDuration(duration) {
    if (this.timings.length >= 1000) {
      this.timings.splice(0, 1);
    }

    this.timings.push(duration);
  }

  /**
   * @private
   * Applies default values from the config object provided in the constructor.
   */
  Loop.prototype.applyDefaults = function applyDefaults() {
    const config = this.config;

    this.speed = config.speed || 100;
  }

  /**
   * @class RenderLoop
   * @extends Loop
   * A subclass of Loop which uses requestAnimationFrame() to run just before
   * the browser is about to repaint. This is an ideal time for DOM manipulation.
   */
  function RenderLoop(config) {
    Loop.call(this, config);
  }

  extendClass(RenderLoop, Loop);

  /**
   * @protected
   * @override
   * Overridden to invoke requestAnimationFrame() instead of setInterval().
   */
  RenderLoop.prototype.doStart = function doStart() {
    this.id = requestAnimationFrame(this.run.bind(this));
  }

  /**
   * @protected
   * @override
   * Overridden to invoke requestAnimationFrame() instead of setInterval().
   */
  RenderLoop.prototype.run = function run() {
    this.doRun();

    // Hook into the next animation frame as well
    if (this.state !== State.STOPPED) this.doStart();
  }

  /**
   * @protected
   * @override
   * Overridden to cancel the animation frame.
   */
  RenderLoop.prototype.doStop = function doStop() {
    cancelAnimationFrame(this.id);
    this.id = null;
  }

  /**
   * @override
   * Stubbed setSpeed method since requestAnimationFrame() doesn't support
   * changing the speed.
   */
  RenderLoop.prototype.setSpeed = function setSpeed() {}

  window.Loop = Loop;
  window.RenderLoop = RenderLoop;

})();
