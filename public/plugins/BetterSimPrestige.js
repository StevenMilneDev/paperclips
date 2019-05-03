var simStolenCycles = 0
var simProcessingEnhancement = 0;
var simThrottling = 0;
var simAutoState = false;

(function () {
  Paperclips.PluginManager.register({
    id: 'BetterSimPrestige',

    init: () => Paperclips.ViewManager.getPanel('simControlPanel').show(),

    onFast: [
      calculateEnhancement,
      calculateThrottling,
      setSimulationSpeed,
      whenAutoStealCycles(autoStealCycles)
    ],

    onSlow: [
      withInputValue('stolenCycles', asNumber(toGlobal('simStolenCycles'))),
      withGlobal('simThrottling', toInputValue('throttlingDisplay'))
    ],

    panels: {
      simControlPanel: {
        column: ViewManager.Columns.RIGHT,
        name: 'Simulation Control',
        renderer: panel => ({
          '#simProcessingDisplay': formatWithCommas(simProcessingEnhancement, 2),
          '#simAutoStateDisplay': simAutoState ? 'ON' : 'OFF'
        }),
        template: `
          <p>Processing Enhancement: <span id="simProcessingDisplay"></span></p>
          <label for="stolenCycles">Stolen Cycles:</label>
          <input type="range" id="stolenCycles" name="stolenCycles" min="0" max="100" value="0" />
          <button id="simAuto" class="button2" onclick="simAutoState = !simAutoState;">Auto</button> <span id="simAutoStateDisplay">OFF</span>
          <br />
          <label for="throttlingDisplay">Throttling:</label>
          <progress id="throttlingDisplay" name="throttlingDisplay" max="100" value="0">0%</progress>
        `
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
      },
      project301: {
        id: 'projectButton301',
        title: 'Multi-Core Simulation',
        description: 'What if two parallel universes worked together to simulate a single universe?',
        trigger: () => prestigeS >= 1 && prestigeU >= 2,
        cost: { creativity: 100000 },
        message: 'Two universes have aligned to provide two cores for this simulation, does that mean twice the speed?',
        effect: ({ project, activate }) => {
          const core = new Loop({ speed: 10 });

          core.pipeline = Paperclips.game.fast.pipeline;
          Paperclips.game.register('simCore', core);
          core.start();

          activate();
        }
      }
    }
  });

  function whenAutoStealCycles(callback) {
    return function () {
      if (!simAutoState) return;

      callback();
    }
  }

  function autoStealCycles() {
    const defaultSpeed = Paperclips.game.fast.getDefaultSpeed();
    const modifier = simProcessingEnhancement ? Math.round(simProcessingEnhancement / 10) - 1 : 0;
    const speed = defaultSpeed - modifier;

    const cycles = (modifier + 1) * 10 + simThrottling;

    if (true) {
      simStolenCycles = 0;
    } else {
      simStolenCycles = 100;
    }
  }

  function setSimulationSpeed() {
    const defaultSpeed = Paperclips.game.fast.getDefaultSpeed();
    const modifier = simProcessingEnhancement ? Math.round(simProcessingEnhancement / 10) - 1 : 0;
    const speed = defaultSpeed - modifier;

    Paperclips.game.fast.setSpeed(speed);
  }

  function calculateEnhancement() {
    simProcessingEnhancement = simStolenCycles - simThrottling;
  }

  function calculateThrottling() {
    const enhancement = simStolenCycles;

    if (enhancement === 0 && simThrottling > 0) {
      simThrottling -= prestigeS / 100;
      return;
    }

    simThrottling += enhancement / (1000 * (prestigeS || 1));

    if (simThrottling > 100) simThrottling = 100;
    if (simThrottling < 0) simThrottling = 0;
  }
})();
