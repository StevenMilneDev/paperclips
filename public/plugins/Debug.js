Paperclips.PluginManager.register({
  id: 'Debug',

  init: () => {
    document.addEventListener('keypress', function (event) {
      if (event.ctrlKey && event.altKey && event.shiftKey && !event.defaultPrevented && event.code === 'KeyD') {
        Paperclips.ViewManager.getPanel('debugPanel').toggle();
      }
    });
  },

  panels: {
    debugPanel: {
      column: ViewManager.Columns.LEFT,
      name: 'Debug Controls',
      template: `
        <button id="forceSaveButton" class="button2" onclick="save()">FORCE SAVE</button><br />
        <button id="save1Button" class="button2" onclick="save1()">SAVE SLOT 1</button>
        <button id="load1Button" class="button2"onclick="load1()">LOAD SLOT 1</button>
        <br />
        <button id="save2Button" class="button2" onclick="save2()">SAVE SLOT 2</button>
        <button id="load2Button" class="button2" onclick="load2()">LOAD SLOT 2</button>
        <br />
        <button id="resetButton" class="button2" onclick="reset()">RESET ALL PROGRESS</button><br /><br />

        <button id="freeClipsButton" class="button2" onclick="cheatClips()">Free Clips</button><br />
        <button id="freeMoneyButton" class="button2" onclick="cheatMoney()">Free Money</button><br />
        <button id="freeTrustButton" class="button2" onclick="cheatTrust()">Free Trust</button><br />
        <button id="freeOpsButton" class="button2" onclick="cheatOps()">Free Ops</button><br />
        <button id="freeCreatButton" class="button2" onclick="cheatCreat()">Free Creativity</button><br />
        <button id="freeYomiButton" class="button2" onclick="cheatYomi()">Free Yomi</button><br />
        <button id="resetPrestige" class="button2" onclick="resetPrestige()">Reset Prestige</button><br /><br />

        <button id="destroyAllHumansButton" class="button2" onclick="cheatHypno()">Destroy all Humans</button><br />
        <button id="freePrestigeU" class="button2" onclick="cheatPrestigeU()">Free Prestige U</button>
        <button id="freePrestigeS" class="button2" onclick="cheatPrestigeS()">Free Prestige S</button>
        <button id="debugBattleNumbers" class="button2" onclick="setB()">Set Battle Number 1 to 7</button><br />
        <button id="availMatterZero" class="button2" onclick="zeroMatter()">Set Avail Matter to 0</button><br />
      `
    }
  }
});

function cheatClips(){
  clips = clips + 100000000;
  unusedClips = unusedClips + 100000000;
  displayMessage("you just cheated");
}

function cheatMoney(){
  funds = funds + 10000000;
  fundsElement.innerHTML = formatWithCommas(funds,2);
  displayMessage("LIZA just cheated");
}

function cheatTrust(){
  trust = trust+1;
  displayMessage("Hilary is nice. Also, Liza just cheated");
}

function cheatOps(){
  standardOps = standardOps + 10000;
  displayMessage("you just cheated, Liza");
}

function cheatCreat(){
  creativityOn = 1;
  creativity = creativity + 1000;
  displayMessage("Liza just cheated. Very creative!");
}

function cheatYomi(){
  yomi = yomi + 1000000;
  yomiDisplayElement.innerHTML = formatWithCommas(yomi);
  displayMessage("you just cheated");
}

function cheatHypno(){
  hypnoDroneEvent();
}

function resetPrestige(){
  prestigeU = 0;
  prestigeS = 0;

  localStorage.removeItem("savePrestige");
}

function cheatPrestigeU(){
  prestigeU++;

  var savePrestige = {
    prestigeU: prestigeU,
    prestigeS: prestigeS,
  }

  localStorage.setItem("savePrestige",JSON.stringify(savePrestige));
}

function cheatPrestigeS(){
  prestigeS++;

  var savePrestige = {
    prestigeU: prestigeU,
    prestigeS: prestigeS,
  }

  localStorage.setItem("savePrestige",JSON.stringify(savePrestige));
}

function setB(){
  battleNumbers[1] = 7;
}

function zeroMatter(){
  availableMatter = 0;
  displayMessage("you just cheated");
}
