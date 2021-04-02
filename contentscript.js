// contentscript.js
// runs on webpage, unique, isolated instance in each tab

console.log("Injecting page functions into HTML.");

var s = document.createElement("script");
s.src = chrome.runtime.getURL("page.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

chrome.runtime.onMessage.addListener(function(obj, sender, resp) {
    switch(obj.message.text) {
        case "reportValidity":
            console.log("Received signal to report validity.");
            document.getElementById("reportButton").click();
            break;
    }
});

// essentially "pass on" message to extension
document.addEventListener("extensionMessage", function(event) {
    // console.log("Content script detected event, with object:");
    // console.log(event.detail);
    chrome.runtime.sendMessage(chrome.runtime.id, event.detail);
});

