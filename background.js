function onWebNav(details) {
    if (details.frameId === 0) {
        // Top-level frame
        var u = new URL(details.url);
        if (u.protocol != "devtools:") {
            if (u.hostname === "www.uptodate.com") {
                chrome.runtime.sendMessage({
                    message: {text: "activate"}
                });
                console.log("Activate message sent.");
            }
            else {
                chrome.runtime.sendMessage({
                    message: {text: "deactivate"}
                });
                console.log("Deactivate message sent.");
            }
        }
    }
}

// chrome.webNavigation.onCommitted.addListener(onWebNav);
// chrome.webNavigation.onCompleted.addListener(onWebNav);
// chrome.webNavigation.onHistoryStateUpdated.addListener(onWebNav);