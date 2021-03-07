chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  document
    .getElementById("ys-download-btn-blink")
    ?.classList.remove("ys-injected-btn-loading");
  if (request.message === "failure") {
    const tooltip = document.getElementById("ys-downloader-tooltip");
    if (tooltip) {
      tooltip.classList.add("tooltip-error");
      tooltip.innerHTML = "Too long 😟";
      setTimeout(() => {
        tooltip.classList.remove("tooltip-error");
        setTimeout(() => {
          tooltip.innerHTML = "Download MP3";
        }, 1000);
      }, 2500);
    }
  }
});

if (!document.getElementById("injected-download-btn")) {
  let downloadBtn = document.createElement("img");
  downloadBtn.src =
    "https://firebasestorage.googleapis.com/v0/b/ys-downloader.appspot.com/o/download.svg?alt=media&token=df6c5c02-6794-4cf7-9b67-e932e98b1ac1";
  downloadBtn.id = "injected-download-btn";

  let downloadToolTip = document.createElement("div");
  downloadToolTip.innerHTML = "Download MP3";
  downloadToolTip.id = "ys-downloader-tooltip";

  const blink = document.createElement("div");
  blink.id = "ys-download-btn-blink";

  let container = document.createElement("div");
  container.id = "ys-download-container";
  container.appendChild(blink);
  container.appendChild(downloadBtn);
  container.appendChild(downloadToolTip);

  const youtubeButtons = document.getElementById("menu-container");
  youtubeButtons?.insertBefore(container, youtubeButtons.firstChild);

  const sendMsgForeground = msg => {
    chrome.runtime.sendMessage({ message: msg });
  };

  downloadBtn.onclick = () => {
    sendMsgForeground("download");
    blink.classList.add("ys-injected-btn-loading");
  };
}
