function hideElement(element) {
  return function () {
    element.style.display = 'none';
  }
}

function showElement(element) {
  return function () {
    element.style.display = '';
  }
}

function renderElement(element, renderer) {
  return function () {
    element.innerHTML = renderer();
  }
}

function withHumans(callback) {
  return function () {
    if(!humanFlag) return;

    callback();
  }
}

function withoutHumans(callback) {
  return function () {
    if(humanFlag) return;

    callback();
  }
}

function withComputer(callback) {
  return function () {
    if(!compFlag) return;

    callback();
  }
}

function withQuantumComputer(callback) {
  return function () {
    if(!qFlag) return;

    callback();
  }
}

function withProbes(callback) {
  return function () {
    if(probeCount <= 0) return;

    callback();
  }
}

function withoutProbes(callback) {
  return function () {
    if(probeCount > 0) return;

    callback();
  }
}

function onEarth(callback) {
  return function () {
    if(spaceFlag) return;

    callback();
  }
}

function inSpace(callback) {
  return function () {
    if(!spaceFlag) return;

    callback();
  }
}

function dismantleLevel(level, callback) {
  return function () {
    if(dismantle < level) return;

    callback();
  }
}

function endTimerLevel(timer, level, callback) {
  return function () {
    if(window['endTimer' + timer.toString()] < level) return;

    callback();
  }
}

function endTimerIs(timer, level, callback) {
  return function () {
    if(window['endTimer' + timer.toString()] == level) return;

    callback();
  }
}

function milestoneIs(value, callback) {
  return function () {
    if(milestoneFlag != value) return;

    callback();
  }
}

function throttle(iterations, callback) {
  let count = 0;

  return function () {
    if(++count >= iterations) {
      count = 0;
      callback();
    }
  }
}

function withStock(callback) {
  return function () {
    if(portfolioSize <= 0) return;

    callback()
  }
}

function withInvestmentEngine(callback) {
  return function () {
    if(!investmentEngineFlag) return;

    callback();
  }
}

function withWireBuyerOn(callback) {
  return function () {
    if(!wireBuyerFlag || !wireBuyerStatus) return;

    callback();
  }
}

function withCreativity(callback) {
  return function () {
    if (!creativityOn || operations < (memory * 1000)) return;

    callback();
  }
}

function whenProjectComplete(project, callback) {
  return function () {
    if(!project.flag) return;

    callback();
  }
}

function when(condition, callback) {
  return function () {
    if(!condition()) return;

    callback();
  }
}

function chain(callbacks) {
  return function () {
    for(let callback of callbacks) {
      callback();
    }
  }
}

function atRandom(callback, chance) {
  return function () {
    if(Math.random() >= chance) return;

    callback()
  }
}
