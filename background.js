// check whether it is a youtube page
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  //check url include youtube tab 
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    //https://www.youtube.com/watch?v=0n809nd4Zu4&t=1312s going to grab unique video values after '?' => 'v=0n809nd4Zu4&t=1312s'
    const queryParameters = tab.url.split("?")[1];
    //'URLSearchParams' API provide a way to get the data in the URL query parameters.
    const urlParameters = new URLSearchParams(queryParameters);

    // send message to contentScript sayinh that 'A new video is loaded'
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"), //this will grab the value '0n809nd4Zu4&t=1312s'
    });
  }
});
