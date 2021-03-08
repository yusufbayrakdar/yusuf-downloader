const sendMsgToForeground = msg => {
  chrome.tabs.getSelected(({ id }) => {
    chrome.tabs.sendMessage(id, { message: msg });
  });
};

const injectDownloadButton = () => {
  const inject = tabId => {
    chrome.tabs.get(tabId, tab => {
      if (/^https:\/\/www\.youtube/.test(tab.url)) {
        chrome.tabs.insertCSS(null, { file: "./injectedDownload.css" });
        chrome.tabs.executeScript(null, { file: "./foreground.js" });
      }
    });
  };
  chrome.tabs.onActivated.addListener(tab => {
    inject(tab.tabId);
  });
  chrome.tabs.onUpdated.addListener(tabId => {
    inject(tabId);
  });
};

const setOnChangeListenerForDownload = () => {
  chrome.downloads.onChanged.addListener(delta => {
    sendMsgToForeground(delta.error ? "failure" : "success");
    if (delta.error) {
      chrome.downloads.erase({ id: delta.id });
    }
  });
};

async function downloadVideo() {
  try {
    chrome.tabs.getSelected(null, tab => {
      let url = tab.url;
      chrome.downloads.download({
        method: "GET",
        url: `https://yusuf-downloader.herokuapp.com/download/mp3/?url=${url}`
      });
    });
  } catch (error) {
    console.log(error);
  }
}

const addDownloadListenerForInjectedBtn = async () => {
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.message === "download") {
        downloadVideo();
      } else {
        sendResponse({ message: "wrong message" });
      }
    }
  );
};

setOnChangeListenerForDownload();
addDownloadListenerForInjectedBtn();
injectDownloadButton();
