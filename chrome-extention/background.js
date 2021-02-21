async function downloadVideo() {
  chrome.tabs.getSelected(null, tab => {
    let url = tab.url;
    $("#loader").css("display", "block");
    $("#video-image").css("filter", "brightness(50%)");
    chrome.downloads.download(
      {
        method: "GET",
        url: `https://yusuf-downloader.herokuapp.com/download/mp3/?url=${url}`
      },
      () => {
        $("#loader").css("display", "none");
        $("#video-image").css("filter", "brightness(100%)");
      }
    );
  });
}
function getUrl() {
  chrome.tabs.getSelected(null, tab => {
    let url = tab.url;
    let videoId = url.replace(/(.+watch\?v=|&.+)/g, "");
    document.getElementById(
      "video-image"
    ).src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  });
}
