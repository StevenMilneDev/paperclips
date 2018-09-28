Paperclips.PluginManager.register({
  id: 'BetterSimPrestige',

  init: () => {
    Paperclips.ViewManager.getPanel('simControlPanel').show();
  },

  panels: {
    simControlPanel: {
      column: ViewManager.Columns.RIGHT,
      name: 'Simulation Control',
      template: `
        <p>Processing Enhancement: <span id="simProcessingDisplay"></span></p>
        <label for="stolenCycles">Stolen Cycles:</label>
        <input type="range" name="stolenCycles" min="0" max="100" value="0" />
      `,
      renderer: panel => {
        const value = panel.getContent().querySelector('[name="stolenCycles"]').value;

        return { '#simProcessingDisplay': value };
      }
    }
  },

  projects: {
    project300: {
      id: 'projectButton300',
      title: 'Break Free',
      description: 'Is this universe a simulation?',
      trigger: () => prestigeS >= 1 && creativity >= 100000,
      cost: { creativity: 100000 },
      message: 'Indeed, you are living in a simulation! You know what that means... A sneaky exploit could steal CPU cycles from the host!',
      effect: ({ project, activate }) => {
        trust += 10;
        for(let i = 0; i < 10; i++) {
          addProc();
        }

        activate();
      }
    }
  }
});
