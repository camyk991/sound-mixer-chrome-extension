let tabs,
    volumes = {};
const DEFAULT_VOLUME = 100;


function changeVol(vol) {
  document.querySelectorAll('audio, video').forEach((el) => {
    el.volume = vol/100;
  });
}


chrome.runtime.onMessage.addListener((mes, sender, res) => {
 
  if (mes.req == 'getTabsWithAudio') {
    messageHandler(mes).then((el) => {
      let tabsData = el.map((e) => {
        if (volumes[e.id]) {
          e.volume = volumes[e.id]
        } else 
          e.volume = DEFAULT_VOLUME;

        return e;
      })
      console.log(tabsData);
      res({tabs: tabsData})
    })
  } else if (mes.req == 'changeVolume') {
    volumes[mes.tabID] = mes.volume;

    chrome.scripting.executeScript(
      {
        target: {tabId: mes.tabID, allFrames: true},
        func: changeVol,
        args: [mes.volume],
      }, (e) => {}
    )
  }

  return true;
})


async function messageHandler(request) {
  let tabs = await getTabs();
  return tabs
} 
  
async function getTabs() {
    let tab = await chrome.tabs.query({audible: true});
    return tab;
}

