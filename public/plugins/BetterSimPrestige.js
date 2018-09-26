Paperclips.PluginManager.register({
  id: 'BetterSimPrestige',

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
