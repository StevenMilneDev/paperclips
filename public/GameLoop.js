(function () {

  const Type = Object.freeze({
    SLOW: 'SLOW',
    FAST: 'FAST',
    RENDER: 'RENDER'
  })

  const State = Object.freeze({
    STOPPED: 'STOPPED',
    RUNNING: 'RUNNING'
  })

  /**
   * @class GameLoop
   * This class encapsulates the game loop logic.
   * @param {Object} config A config object containing initial values for settings
   */
  function GameLoop (config) {
    config = config || {}

    this.listenersByType = {}
    this.state = State.STOPPED
  }

  /**
   * @static
   * An enum which keys each of the loop types supported by the GameLoop.
   */
  GameLoop.Type = Type

  /**
   * @static
   * An enum which keys each of the states that the GameLoop can be in.
   */
  GameLoop.State = State

  /**
   * Starts running the game loops at the configured speeds.
   */
  GameLoop.prototype.start = function start() {
    if(this.state === State.RUNNING) return

    this.renderId = requestAnimationFrame(this.render.bind(this))
    this.slowId = setInterval(this.slow.bind(this), 100)
    this.fastId = setInterval(this.fast.bind(this), 10)

    this.state = State.RUNNING
  }

  /**
   * Stops all of the game loops, effectively pausing the game.
   */
  GameLoop.prototype.stop = function stop() {
    if(this.state === State.STOPPED) return

    cancelAnimationFrame(this.renderId)
    clearInterval(this.slowId)
    clearInterval(this.fastId)

    this.state = State.STOPPED
  }

  /**
   * Registers a collection of callbacks to be invoked on each iteration of the
   * slow loop.
   * @param {Function[]} callbacks An array of callbacks to invoke on the slow loop
   */
  GameLoop.prototype.onSlow = function onSlow(callbacks) {
    if (typeof callbacks === 'function') {
      return this.register(Type.SLOW, callbacks)
    }

    for(let callback of callbacks) {
      this.register(Type.SLOW, callback)
    }
  }

  /**
   * Registers a collection of callbacks to be invoked on each iteration of the
   * fast loop.
   * @param {Function[]} callbacks An array of callbacks to invoke on the fast loop
   */
  GameLoop.prototype.onFast = function onFast(callbacks) {
    if (typeof callbacks === 'function') {
      return this.register(Type.FAST, callbacks)
    }

    for(let callback of callbacks) {
      this.register(Type.FAST, callback)
    }
  }

  /**
   * Registers a collection of callbacks to be invoked on each iteration of the
   * render loop.
   * @param {Function[]} callbacks An array of callbacks to invoke on the render loop
   */
  GameLoop.prototype.onRender = function onRender(callbacks) {
    if (typeof callbacks === 'function') {
      return this.register(Type.RENDER, callbacks)
    }

    for(let callback of callbacks) {
      this.register(Type.RENDER, callback)
    }
  }

  /**
   * Registers the provided function to be called in the specified loop.
   * @param {LoopType} loop The loop to call the function in
   * @param {Function|Function[]} fn The function to call when the loop is invoked
   */
  GameLoop.prototype.register = function register(loop, fn) {
    let listeners = this.listenersByType[loop]

    if(!listeners) {
      listeners = this.listenersByType[loop] = []
    }

    listeners.push(fn)
  }

  GameLoop.prototype.unregister = function unregister(loop, fn) {
    const listeners = this.listenersByType[loop]
    const index = listeners.indexOf(fn)

    if(index >= 0) {
      listeners.splice(index, 1)
    }
  }

  /**
   * @private
   * The implementation for the slow game loop.
   */
  GameLoop.prototype.slow = function slow() {
    const listeners = this.listenersByType[Type.SLOW]

    if(listeners) {
      listeners.map(fn => fn())
    }
  }

  /**
   * @private
   * The implementation for the fast game loop.
   */
  GameLoop.prototype.fast = function fast() {
    const listeners = this.listenersByType[Type.FAST]

    if(listeners) {
      listeners.map(fn => fn())
    }
  }

  /**
   * @private
   * The implementation for the render loop which updates the DOM before the
   * browser redraws the page.
   */
  GameLoop.prototype.render = function render() {
    const listeners = this.listenersByType[Type.RENDER]

    if(listeners) {
      try {
        listeners.map(fn => fn())
      } catch(e) {
        console.error(e)
      }
    }

    this.renderId = requestAnimationFrame(this.render.bind(this))
  }

  window.GameLoop = GameLoop
})();
