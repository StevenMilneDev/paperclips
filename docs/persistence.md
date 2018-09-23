# Universal Paperclips
## Persistence
Universal Paperclips is a simple web game implemented in HTML and Javascript and uses client side storage to persist the state of the users game. The game state during runtime is held in a large quantity of global variables, some of these global variables are declared in [globals.js](../public/globals.js) but most are scattered around each of the Javascript files.

A collection of functions at [main.js:4700](../public/main.js) read and write the global state into the browsers local storage. The persistence functions are;

- `save()`
- `save1()`
- `save2()`
- `load()`
- `load1()`
- `load2()`
- `reset()`
- `loadPrestige()`

The `save()` function is called in the slow game loop ([main.js:4594](../public/main.js)) so progress is saved automatically. The save is throttled to be called once every 250 iterations (slow game loop runs every 100ms) or once every 25 seconds. The `save()` function creates a `saveGame` object which contains the values of each of the global variables mapped by their names. Arrays are also built up from the `projects`, `activeProjects` and `allStrats` arrays. The arrays and objects created are then JSON encoded and saved into local storage;

```javascript
localStorage.setItem("saveGame",JSON.stringify(saveGame));
localStorage.setItem("saveProjectsUses",JSON.stringify(projectsUses));
localStorage.setItem("saveProjectsFlags",JSON.stringify(projectsFlags));
localStorage.setItem("saveProjectsActive",JSON.stringify(projectsActive));
localStorage.setItem("saveStratsActive",JSON.stringify(stratsActive));
```

The other save functions (`save1()` and `save2()`) do the exact same thing but suffix the local storage keys with a number which looks like it provides multiple save slots. The save slots can be used by the disabled cheat buttons in [index.html:300](../public/index.html).

The save game system is hooked into from [main.js:4176](../public/main.js) where local storage is checked for the presence of the item `saveGame`. If the save is present then the `load()` function is called;

```javascript
if (localStorage.getItem("saveGame") != null) {
    load();
}

if (localStorage.getItem("savePrestige") != null) {
    loadPrestige();
    refresh();
}
```
