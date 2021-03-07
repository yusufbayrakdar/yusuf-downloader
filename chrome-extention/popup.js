chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  blink.classList.remove("ys-injected-btn-loading");
});

const setOnChangeListenerForDownload = () => {
  chrome.downloads.onChanged.addListener(delta => {
    $("#loader").css("display", "none");
    if (delta.error) {
      $("#video-image").css("filter", "brightness(20%)");
      $("#error").load("./error.html");
    } else {
      $("#video-image").css("filter", "brightness(100%)");
    }
  });
};

function getUrl() {
  chrome.tabs.getSelected(null, tab => {
    let url = tab.url;
    let videoId = url.replace(/(.+watch\?v=|&.+)/g, "");
    $("#video-image").attr(
      "src",
      `https://img.youtube.com/vi/${videoId}/0.jpg`
    );
  });
}

const sendMsg = msg => {
  chrome.runtime.sendMessage({ message: msg });
};

setOnChangeListenerForDownload();
getUrl();
$("#download-btn").click(function() {
  $("#loader").css("display", "block");
  $("#video-image").css("filter", "brightness(50%)");
  sendMsg("download");
});
$(function() {
  $("#loader").css("display", "none");
  $("#loader").load("./loader.html");
});
