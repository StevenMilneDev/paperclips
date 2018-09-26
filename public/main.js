
var Paperclips = {};

Paperclips.game = new GameLoop();
Paperclips.PluginManager = new PluginManager();

// If there is save data then load it
if (hasExistingSave()) {
  load();

  if(hasPresige()) {
    loadPrestige();
    refresh();
  }
}

Paperclips.game.onFast([
  incrementTicks,
  milestoneCheck,
  buttonUpdate,
  withComputer(calculateOperations),
  withHumans(chain([
    calculateTrust,
    demandCurve,
    withWireBuyerOn(when(() => wire <= 1, buyWire))
  ])),
  withQuantumComputer(quantumCompute),
  incrementClipRateTracker,
  updateClipRate,
  withInvestmentEngine(throttle(10000, reportInvestmentRevenue)),
  withProbes(exploreUniverse),
  withoutHumans(chain([
    onEarth(updateDroneButtons),
    updatePower,
    updateSwarm,
    acquireMatter,
    processMatter,
    calculateFactoryClips
  ])),
  inSpace(chain([
    withoutProbes(() => probeCount = 0),
    encounterHazards,
    spawnFactories,
    spawnHarvesters,
    spawnWireDrones,
    spawnProbes,
    drift,
    war
  ])),
  autoClipper,
  withCreativity(calculateCreativity)
])

Paperclips.game.onSlow([
  adjustWirePrice,
  manageProjects,
  withHumans(chain([
    salesCalculator,
    throttle(10, chain([
      calculateRev,
      stockShop
    ])),
    withStock(throttle(25, chain([
      atRandom(sellStock, 0.3),
      updateStocks
    ]))),
  ])),
  throttle(250, save)
]);

Paperclips.game.onRender([
  renderStockList,
  synchroniseStratPicker,
  buttonUpdate,
  updateStats,
  dismantleLevel(1, chain([
    hideElement(probeDesignDivElement),
    endTimerLevel(1, 50, hideElement(increaseProbeTrustDivElement)),
    endTimerLevel(1, 100, hideElement(increaseMaxTrustDivElement)),
    endTimerLevel(1, 150, hideElement(spaceDivElement)),
    endTimerLevel(1, 175, hideElement(battleCanvasDivElement)),
    endTimerLevel(1, 190, hideElement(honorDivElement))
  ])),
  dismantleLevel(2, chain([
    hideElement(wireProductionDivElement),
    showElement(wireTransDivElement),
    endTimerLevel(2, 50, hideElement(swarmGiftDivElement)),
    endTimerLevel(2, 100, hideElement(swarmEngineElement)),
    endTimerLevel(2, 150, hideElement(swarmSliderDivElement))
  ])),
  dismantleLevel(3, chain([
    hideElement(factoryDivSpaceElement),
    hideElement(clipsPerSecDivElement),
    hideElement(tothDivElement)
  ])),
  dismantleLevel(4, chain([
    hideElement(strategyEngineElement),
    hideElement(tournamentManagementElement)
  ])),
  dismantleLevel(5, chain([
    hideElement(btnQcomputeElement),
    dimQuantumChips,
    endTimerIs(4, 10, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 10, hideElement(qChipsElements[9])),
    endTimerIs(4, 60, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 60, hideElement(qChipsElements[8])),
    endTimerIs(4, 100, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 100, hideElement(qChipsElements[7])),
    endTimerIs(4, 130, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 130, hideElement(qChipsElements[6])),
    endTimerIs(4, 150, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 150, hideElement(qChipsElements[5])),
    endTimerIs(4, 160, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 160, hideElement(qChipsElements[4])),
    endTimerIs(4, 165, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 165, hideElement(qChipsElements[3])),
    endTimerIs(4, 169, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 169, hideElement(qChipsElements[2])),
    endTimerIs(4, 172, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 172, hideElement(qChipsElements[1])),
    endTimerIs(4, 174, chain([
      incrementWire,
      renderElement(transWireElement, () => formatWithCommas(wire)),
    ])),
    endTimerLevel(4, 174, hideElement(qChipsElements[0])),
    endTimerLevel(4, 250, hideElement(qComputingElement))
  ])),
  dismantleLevel(6, hideElement(processorDisplayElement)),
  dismantleLevel(7, chain([
    hideElement(compDivElement),
    hideElement(projectsDivElement)
  ])),
  whenProjectComplete(project148, incrementEndTimer(1)),
  whenProjectComplete(project211, incrementEndTimer(2)),
  whenProjectComplete(project212, incrementEndTimer(3)),
  whenProjectComplete(project213, incrementEndTimer(4)),
  whenProjectComplete(project215, incrementEndTimer(5)),
  whenProjectComplete(project216, when(() => wire == 0, incrementEndTimer(6))),
  endTimerLevel(6, 250, hideElement(creationDivElement)),
  endTimerLevel(6, 500, milestoneIs(15, chain([
    playThrenody,
    () => displayMessage("Universal Paperclips"),
    incrementMilestone
  ]))),
  endTimerLevel(6, 600, milestoneIs(16, chain([
    () => displayMessage("a game by Frank Lantz"),
    incrementMilestone
  ]))),
  endTimerLevel(6, 700, milestoneIs(17, chain([
    () => displayMessage("combat programming by Bennett Foddy"),
    incrementMilestone
  ]))),
  endTimerLevel(6, 800, milestoneIs(18, chain([
    () => displayMessage("'Riversong' by Tonto's Expanding Headband used by kind permission of Malcolm Cecil"),
    incrementMilestone
  ]))),
  endTimerLevel(6, 800, milestoneIs(18, chain([
    () => displayMessage("'&#169; 2017 Everybody House Games"),
    incrementMilestone
  ])))
]);

Paperclips.game.start();
