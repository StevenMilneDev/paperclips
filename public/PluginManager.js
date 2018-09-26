(function () {

  function PluginManager () {
    this.plugins = {};
  }

  PluginManager.prototype.register = function register(plugin) {
    let game = Paperclips.game;

    if (!plugin.id) {
      console.error('Invalid plugin, plugins must have a unique ID', plugin);
      return;
    }

    if (this.plugins[plugin.id]) {
      console.error('Invalid plugin, plugin ID ' + plugin.id + ' is not unique', plugin);
      return;
    }

    if (plugin.onSlow) {
      if (typeof plugin.onSlow === 'function') {
        game.register(GameLoop.Type.SLOW, plugin.onSlow);
      } else {
        game.onSlow(plugin.onSlow);
      }
    }

    if (plugin.onFast) {
      if (typeof plugin.onFast === 'function') {
        game.register(GameLoop.Type.FAST, plugin.onFast);
      } else {
        game.onFast(plugin.onFast);
      }
    }

    if (plugin.onRender) {
      if (typeof plugin.onRender === 'function') {
        game.register(GameLoop.Type.RENDER, plugin.onRender);
      } else {
        game.onRender(plugin.onRender);
      }
    }

    if (plugin.projects) {
      defineProjects(plugin.projects);
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

  window.PluginManager = PluginManager;
})();
