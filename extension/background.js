var hostname = "";
var url = "";
var highlightedText = "";
var fullText = "";
user = ''


var contextMenuItem = {
    "id": "add context",
    "title": "Add Context",
    "contexts": ["selection"]
  };

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create(contextMenuItem);

  chrome.contextMenus.onClicked.addListener(function(clickData, tabData) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "start"}, function(response) {
        console.log("confirmation: ",response.confirm);
      });
    });

    // console.log( "full ClickData from contextMenu: ", clickData);
    console.log("full TabData from contextMenu: ", tabData);
    
  });
});