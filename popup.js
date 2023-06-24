window.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({req: "getTabsWithAudio"},(res) => {
        let tabs = res.tabs,
            html = '',
            favUrl,
            title,
            tabID;
        
        tabs.length ? tabs.forEach((el) => {
            title = el.title;
            favUrl = el.favIconUrl;
            tabID = el.id;

            html += `<li><div class="audio-tab-row"><span class="tabFav" style="background-image: url(${favUrl})"></span>${title}</div><div class="volume-slider"><input type="range" min="0" max="100" value="${el.volume}" class="mxr-volume-slider" tabID="${tabID}"></div></li>`;
        }) : html += 'There are no tabs with playing audio.';

        document.querySelector('#tabsWithAudioList').innerHTML = html;
        addVolumeChangeListeners();
        
    })

    
    

    
})

const addVolumeChangeListeners = () => {
    document.querySelectorAll('.mxr-volume-slider').forEach((el) => {
        el.addEventListener('input', (e) => {

            chrome.runtime.sendMessage({
                req: "changeVolume",
                volume: e.target.value,
                tabID: parseInt(e.target.getAttribute("tabID"))
            })
        })
    })
}