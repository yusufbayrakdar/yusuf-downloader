const resolutionList = ["1080p", "720p", "480p", "360p", "240p", "144p"];
async function downloadVideo() {
    chrome.tabs.getSelected(null, tab => {
        let url = tab.url;
        $("#loader").css("display", "block");
        $("#video-image").css("filter", "brightness(50%)");
        chrome.downloads.download({
            method: 'GET',
            url: `http://localhost:3811/download/mp3/?url=${url}`
        }, () => {
            $("#loader").css("display", "none");
            $("#video-image").css("filter", "brightness(100%)");
        })
    });
}
function getUrl() {
    chrome.tabs.getSelected(null, tab => {
        let url = tab.url;
        let videoId = url.replace(/(.+watch\?v=|&.+)/g, '');
        document.getElementById("video-image").src = `https://img.youtube.com/vi/${videoId}/0.jpg`
    });
}
async function getFormats() {
    chrome.tabs.getSelected(null, async tab => {
        let res = await axios.get('http://localhost:3811/download/formats/', {
            params: {
                url: tab.url
            }
        });

        resolutionList.forEach(resolution => {
            if (res.data.includes(resolution)) {
                $("#select").append(new Option(resolution, resolution));
            }
        });
        return res;
    });
}
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { if (tab.url.includes('youtube.com') && tab.url.includes('watch')) { alert('update'); getFormats(); } });