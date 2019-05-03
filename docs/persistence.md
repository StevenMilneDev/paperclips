# Universal Paperclips
## Persistence
Universal Paperclips is a simple web game implemented in HTML and Javascript and uses client side storage to persist the state of the users game. The game state during runtime is held in a large quantity of global variables, some of these global variables are declared in [globals.js](../public/globals.js) but most are scattered around each of the Javascript files.

A collection of functions at [main.js:4700](../public/main.js) read and write the global state into the browsers local storage. The persistence functions are;

- `save()`, `save1()` and `save2()`
- `load()`, `load1()` and `load2()`
- `reset()`
- `loadPrestige()`

### Saving
The `save()` function is called in the slow game loop ([main.js:4594](../public/main.js)) so progress is saved automatically. The save is throttled to be called once every 250 iterations (slow game loop runs every 100ms) or once every 25 seconds. The `save()` function creates a `saveGame` object which contains the values of each of the global variables mapped by their names. Arrays are also built up from the `projects`, `activeProjects` and `allStrats` arrays. The arrays and objects created are then JSON encoded and saved into local storage;

```javascript
localStorage.setItem("saveGame",JSON.stringify(saveGame));
localStorage.setItem("saveProjectsUses",JSON.stringify(projectsUses));
localStorage.setItem("saveProjectsFlags",JSON.stringify(projectsFlags));
localStorage.setItem("saveProjectsActive",JSON.stringify(projectsActive));
localStorage.setItem("saveStratsActive",JSON.stringify(stratsActive));
```

The other save functions (`save1()` and `save2()`) do the exact same thing but suffix the local storage keys with a number which looks like it provides multiple save slots. The save slots can be used by the disabled cheat buttons in [index.html:300](../public/index.html).

### Loading
The load functions follow a similar pattern to the save functions but in reverse. The JSON save state is loaded and decoded from the browsers local storage and then set on the global state objects. Just like the save functions the load ones are duplicated to support multiple save states.

```javascript
var loadGame = JSON.parse(localStorage.getItem("saveGame"));
var loadProjectsUses = JSON.parse(localStorage.getItem("saveProjectsUses"));
var loadProjectsFlags = JSON.parse(localStorage.getItem("saveProjectsFlags"));
var loadProjectsActive = JSON.parse(localStorage.getItem("saveProjectsActive"));
var loadStratsActive = JSON.parse(localStorage.getItem("saveStratsActive"));
```

The game checks for a save on load of [main.js:300](../public/main.js), local storage is checked only for the presence of the item `saveGame`. If the save is present then the `load()` function is called;

```javascript
if (localStorage.getItem("saveGame") != null) {
    load();
}
```

### Resetting
The game allows the first save slot to be erased allowing a new game to be started. This functionality is exposed though the "RESET ALL PROGRESS" debug button and also through a couple of in-game actions;

- The "The Universe Next Door" project where you can escape to a new universe incrementing your universe prestige
- The "The Universe Within" project where you can escape to a simulated universe incrementing your simulation prestige
- The "Quantum Temporal Reversion" project where you can return to the start of the game

There is also a `resetFlag` variable in the game state which is initialised to the value `2`. This flag is included within the save data on all slots however is only checked when loading from the first slot. If it's value is not 2 on load then the save data is reset. Nothing in the game actually sets this however so this can't be used without save hacking.

The `reset()` function is responsible for restarting the game. It simply removes the local storage items for the first save slot leaving all other save slots intact. The only way to clear the other save slots is to reset the first slot and then subsequently copy the first slot into the slot you want to clear.

**NOTE: Resetting will not remove the `savePrestige` local storage item so prestige levels cannot be reset this way.**

### Load Prestige
Prestige is a way to reset the game state while keeping benefits from previous play throughs. Players can prestige by activating one of two end-game projects, "The Universe Next Door" or "The Universe Within". These will set a `savePrestige` local storage item with the new prestige level and reset the game state by calling `reset()`. There are two prestige types, universe and simulation. The prestige level of each type is used to modify a stat with the universe level buffing the market `demand` value and the simulation level buffing the `creativity` value.

The prestige levels are loaded after the main game state in [main:300](../public/main.js);

```javascript
if (localStorage.getItem("savePrestige") != null) {
    loadPrestige();
    refresh();
}
```

There is only a single `savePrestige` local storage item, which means it is shared among all save slots. So if a single save slot prestiges then they all do. The prestige level can only be reset using the "Reset Prestige" debug button, which will reset prestige for all save slots since it is shared.

### Local Storage
The game uses local storage within the browser to store its data. Local storage is a key-value store which the game uses to store JSON data within. The following local storage keys are used by the game;

- `saveGame` - Stores the currency values in the game
- `saveProjectsUses` - Stores the number of times each project can be used
- `saveProjectsFlags` - Stores the completion state of each project
- `saveProjectsActive` - Stores the active state for each project, active projects are available to do
- `saveStratsActive` - Stores the available strategies
- `savePrestige` - Stores the number of times the game has been reset

All of the above items are duplicated twice with a numeric suffix except from `savePrestige`.

### Refactoring Ideas
Both persistence and state management could do with a refactor as neither are very expandable or maintainable. The `save()` function is 288 lines long and each new item being persisted increases that by a line as each state entry is added to the `saveGame` variables individually. This makes the persistence system hard to extend for the plugins.

Ideally the state management would be refactored so that the game state isn't held as global variables. But this would be hard due to the monolithic nature of the whole game implementation. If the game was implemented as a collection of independent modules then the game state could be drastically simplified, but this would be a very large refactor. Instead I think it would be better to refactor from the storage end first.

A `StorageManager` could be implemented which would take away some of the responsibility from `save()`, specifically the interaction with LocalStorage. It would also make it easier to migrate storage from LocalStorage to other things like IndexedDB or even server-side storage. The core game could still generate it's JSON encoded save states but hand them off for `StorageManager` to store. The `StorageManager` could also expose `StorageManager.onSave()` to allow plugins to hook into the save and even loading events.

A `StateManager` could also be implemented which sits on top of `StorageManager`, modules/plugins could register themselves with the state manager which could return an object which is managed for them and serialised into JSON on save without the module needing to do anything. The state manager would aggregate all of game logic together from scoped modules into a single state which can be handed to the storage manager.
