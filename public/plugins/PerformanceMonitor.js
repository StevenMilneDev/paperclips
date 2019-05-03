Paperclips.PluginManager.register({
  id: 'PerformanceMonitor',

  onSlow: () => {
    const debug = Paperclips.ViewManager.getPanel('debugPanel');

    if (debug && debug.isShown()) {
      Paperclips.ViewManager.getPanel('performanceMonitorPanel').show();
    } else if (debug) {
      Paperclips.ViewManager.getPanel('performanceMonitorPanel').hide();
    } else {
      Paperclips.ViewManager.getPanel('performanceMonitorPanel').show();
    }
  },

  panels: {
    performanceMonitorPanel: {
      column: ViewManager.Columns.EXTRA,
      name: 'DEBUG - Game Performance',
      renderer: panel => ({
        '#perfCpuDisplay': calculateCPUHealth(),
        '#perfSlowSpeed': Paperclips.game.slow.getSpeed(),
        '#perfFastSpeed': Paperclips.game.fast.getSpeed(),
        '#perfCustomSpeed': getCustomSpeed(),
        '#perfSlowDuration': formatWithCommas(Paperclips.game.slow.getAverageTime(), 2),
        '#perfFastDuration': formatWithCommas(Paperclips.game.fast.getAverageTime(), 2),
        '#perfRenderDuration': formatWithCommas(Paperclips.game.render.getAverageTime(), 2),
        '#perfCustomDuration': formatWithCommas(getCustomDuration(), 2)
      }),
      template: `
        <h4>System</h4>
        <p>CPU: <span id="perfCpuDisplay">0</span>%<p>

        <br />

        <h4>Game Loops</h4>
        <p>Slow Loop (<span id="perfSlowSpeed">100</span>ms): <span id="perfSlowDuration"></span>ms</p>
        <p>Fast Loop (<span id="perfFastSpeed">10</span>ms): <span id="perfFastDuration"></span>ms</p>
        <p>Render Loop: <span id="perfRenderDuration"></span>ms</p>
        <p>Custom Loops (<span id="perfCustomSpeed"></span>ms): <span id="perfCustomDuration"></span>ms</p>
      `
    }
  }
});

function getCustomSpeed() {
  const speeds = Paperclips.game.eachCustom( loop => loop.getSpeed() );

  if (speeds.length === 0) return 0;

  return Math.min.apply(null, speeds);
}

function getCustomDuration() {
  let duration = 0;

  Paperclips.game.eachCustom( loop => duration += loop.getAverageTime() );

  return duration;
}

function calculateCPUHealth() {
  const slowFrames = 1000 / Paperclips.game.slow.getSpeed();
  const fastFrames = 1000 / Paperclips.game.fast.getSpeed();
  const renderFrames = 60;

  const slowTime = Paperclips.game.slow.getAverageTime();
  const fastTime = Paperclips.game.fast.getAverageTime();
  const renderTime = Paperclips.game.render.getAverageTime();

  const slowUsage = slowFrames * slowTime;
  const fastUsage = fastFrames * fastTime;
  const renderUsage = renderFrames * renderTime;

  let customUsage = 0;
  Paperclips.game.eachCustom(loop => {
    customUsage += ((1000 / loop.getSpeed()) * loop.getAverageTime());
  });

  const combinedUsage = slowUsage + fastUsage + renderUsage + customUsage;

  return formatWithCommas(combinedUsage / 1000, 2);
}
