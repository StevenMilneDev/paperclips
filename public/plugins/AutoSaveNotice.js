/**
 * NOTE: This plugin must be loaded BEFORE the main.js payload
 */
(function () {
  let originalSave = window.save;

  window.save = function save(slot = 0) {
    displayMessage('Autosaving...');
    originalSave(slot);
  }

  window.addEventListener('load', () => {
    Paperclips.PluginManager.register({
      id: 'AutoSaveNotice'
    });
  })
})();
