(function () {

  /**
   * @class PluginManager
   * This class manages extensions to the game. Extensions can be registered to
   * be included in the game loop.
   */
  function PluginManager () {
    this.plugins = {};
  }

  /**
   * Registers the provided plugin config, attaching it to the game loop and
   * definining custom resources within the games engine.
   * @param {Object} plugin An object containing all of the plugins resources
   * @param {String} plugin.id Required. A unique name to identify the plugin by
   * @param {Function|Function[]} plugin.onSlow The jobs to be added to the slow loop
   * @param {Function|Function[]} plugin.onFast The jobs to be added to the fast loop
   * @param {Function|Function[]} plugin.onRender The jobs to be added to the render loop
   * @param {Function} plugin.init This function is called once the plugin is loaded
   * @param {Object[]} plugin.projects An array of custom project definitions
   * @param {String[]} plugin.templates An array of HTML templates to be injected into the DOM
   */
  PluginManager.prototype.register = function register(plugin) {
    let game = Paperclips.game;

    if(!this.validate(plugin)) {
      return;
    }

    if (plugin.onSlow) {
      game.onSlow(plugin.onSlow);
    }

    if (plugin.onFast) {
      game.onFast(plugin.onFast);
    }

    if (plugin.onRender) {
      game.onRender(plugin.onRender);
    }

    if (plugin.projects) {
      defineProjects(plugin.projects);
    }

    if (plugin.templates) {
      Paperclips.ViewManager.inject(plugin.templates);
    }

    if (plugin.panels) {
      for (let id in plugin.panels) {
        Paperclips.ViewManager.addPanel(id, plugin.panels[id]);
      }
    }

    this.plugins[plugin.id] = plugin;

    if (plugin.init) {
      try{
        plugin.init();
      } catch(e) {
        displayMessage('Plugin "' + plugin.id + '" failed to load');
        console.error(e);

        this.plugins[plugin.id] = null;
        game.unregister(GameLoop.Type.SLOW, plugin.onSlow);
        game.unregister(GameLoop.Type.FAST, plugin.onFast);
        game.unregister(GameLoop.Type.RENDER, plugin.onRender);

        return;
      }
    }

    displayMessage('Loaded plugin "' + plugin.id + '"');
  };

  /**
   * @private
   * Checks the provided plugin config to ensure it is valid. If it is not valid
   * then an error will be logged to the console and false returned.
   * @param {Object} plugin An object to check if it is a valid plugin
   * @param {String} plugin.id A unique name to identify the plugin by
   * @return {Boolean} True if the object is a valid plugin
   */
  PluginManager.prototype.validate = function validate(plugin) {
    if (!plugin.id) {
      console.error('Invalid plugin, plugins must have a unique ID', plugin);
      return false;
    }

    if (this.plugins[plugin.id]) {
      console.error('Invalid plugin, plugin ID ' + plugin.id + ' is not unique', plugin);
      return false;
    }

    return true;
  }

  window.PluginManager = PluginManager;
})();
