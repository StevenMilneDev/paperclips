# Universal Paperclips
## Projects
Projects are activities that you can perform within the game to improve your ability to create paperclips. Projects cost currency to activate but usually buff a stat in return. Projects can be hidden until triggered by a change of state in the game. Each tick all of the projects are polled to see if they are available to purchase.

All of the projects in the game are defined in [projects.js](../public/projects.js) as global objects with names like `project219`. The object follows the following schema;

```javascript
var project999 = {
  id: 'projectButton999',                     // The ID of the button to be generated
  title: 'My Custom Project ',                // The name of the project to be displayed to users
  priceTag: '(100,000 creat)',                // A text representation of the cost of the project
  description: 'Thinks outside the box...',   // A description to be shown in the UI
  trigger: () => true,                        // When true is returned the project is shown in the UI
  uses: 1,                                    // The number of times this project can be activated
  cost: () => true,                           // A function to check if the user can afford the project
  flag: 0,                                    // 0 if project not yet activated, 1 if it has been activated
  element: null,                              // A reference to the element created for the project button
  effect: () => {}                            // Called when the project is activated
};
```

When the game starts the project UI is hidden until the user creates 2000 paperclips. Once 2000 clips have been made the UI is shown;

```html
<div id="projectsDiv">
  <b>Projects</b>
  <br />
  <hr>
  <div id="projectListTop"></div>
</div>
```

Initially it contains no projects, however the main game loop polls each of the project objects using the `manageProjects()` function which calls the `trigger()` function. Any triggers that return true will render a `<button>` element to the `#projectListTop` element. This button element contains the `title`, `priceTag` and `description` of the project it represents. The project is then pushed into the global `activeProjects` array. Afterwards the `activeProjects` array is iterated over and each active project has it's `cost()` function invoked if it returns `false` then the associated button element is disabled.

The `displayProjects()` function renders a project button and listens to the `click` event of the button and invokes the `effect()` function when fired. The `effect()` function is responsible for consuming the cost of the project (i.e. decrementing the applicable currency), modifying the applicable stat and subsequently updating the the stat element with the new value. The `effect()` function can display messages in the console shown at the top of the page by calling the `displayMessage('message')` function. The `effect()` function is also responsible for removing the project element from the DOM and from the `activeProjects` array.

**IDEA:** Perhaps it might be best to refactor the `onclick` callback set in `displayProjects()` to remove the project element from the DOM and also from `activeProjects` so that each project doesn't need to do this itself.

### Custom Projects
It is possible to load custom projects into the game since the `projects` array is a global variable. Below is an example of a custom project definition;

```javascript
var project999 = {
  id: 'project999Buttton',
  title: 'Break Free ',
  priceTag: '(100,000 creat)',
  description: 'Is this universe a simulation?',
  trigger: () => prestigeS >= 1 && creativity >= 100000,
  uses: 1,
  cost: () => creativity >= 100000,
  flag: 0,
  element: null,
  effect: () => {
    // Consume project cost
    creativity -= 100000;

    // Perform effect
    displayMessage('Indeed, you are living in a simulation! You know what that means... A sneaky exploit could steal CPU cycles from the host!');
    trust += 10;
    for(let i = 0; i < 10; i++) {
      addProc();
    }

    // Remove project from DOM and activeProjects
    project999.element.parentNode.removeChild(project999.element);
    let index = activeProjects.indexOf(project999)
    activeProjects.splice(index, 1);
  }
};

projects.push(project999);
```

Since everything is global, custom projects have just as much power as the native projects do. However there is no way to easily add new currencies or DOM for a project without modifying the core game files.
