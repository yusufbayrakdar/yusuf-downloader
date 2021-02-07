async function downloadVideo() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        window.location.assign(`http://localhost:3811/download/?url=${url}`);
    });
}
function getUrl() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        let videoId = url.replace(/.+watch\?v=/g, '');
        document.getElementById("video-image").src = `https://img.youtube.com/vi/${videoId}/0.jpg`
    });
}