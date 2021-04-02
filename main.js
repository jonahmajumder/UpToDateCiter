// FUNCTIONS DESIGNED TO BE RUN IN EXTENSION SCOPE

function activate() {
	document.getElementById("saveButton").disabled = false;
	document.getElementById("copyButton").disabled = false;
	document.getElementById("savetooltip").innerText = "Click to download citation file!";
	document.getElementById("copytooltip").innerText = "Click to copy citation to clipboard!";
}

function deactivate() {
	document.getElementById("saveButton").disabled = true;
	document.getElementById("copyButton").disabled = true;
	document.getElementById("savetooltip").innerText = "Navigate to an UpToDate Article!";
	document.getElementById("copytooltip").innerText = "Navigate to an UpToDate Article!";
}

function toRisFile(properties) {
	var filestring = "";
	filestring += "TY  - CHAP\r\n";
	for (var i = 0; i < properties.authors.length; i++) {
		filestring += "A1  - " + properties.authors[i] + "\r\n";
	}
	for (var i = 0; i < properties.editors.length; i++) {
		filestring += "A2  - " + properties.editors[i] + "\r\n";
	}
	filestring += "PB  - " + properties.publisher + "\r\n";
	filestring += "CY  - " + properties.placePublished + "\r\n";
	filestring += "PY  - " + properties.year + "\r\n";
	filestring += "T1  - " + properties.title + "\r\n";
	filestring += "T2  - " + properties.bookTitle + "\r\n";
	filestring += "UR  - " + properties.url + "\r\n";
	filestring += "Y2  - " + properties.accessDate + "\r\n";
	filestring += "ER  - "

	return filestring;
}

function saveFile(properties) {
	var s = toRisFile(properties);
	var anch = document.getElementById("dllink");
	var filename = "uptodateTopic" + properties.topicNumber.toString();
	if (filename != null) {
		var newfilename = filename.split(".")[0] + ".ris"; // change when ris formatted
		anch.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(s);
		anch.download = newfilename;
		anch.click();
	}
}

function formatNameList(list) {
	var textstring = "";
	var name;
	for (var i = 0; i < list.length; i++) {
		if (i === 0) {
			textstring += list[i];
		}
		else {
			name = list[i].split(",").map(p => p.trim()).reverse().join(" ");
			if (i === list.length - 1) {
				textstring += ", and " + name;
			}
			else {
				textstring += ", " + name;
			}
		}
	}
	return textstring;
}

function toFormatted(properties) {
	var textstring = "";
	textstring += formatNameList(properties.authors) + ". ";

	textstring += '"' + properties.title + '." ';
	textstring += properties.bookTitle.slice(0,1).toUpperCase() + properties.bookTitle.slice(1).toLowerCase() + ". ";

	if (properties.editors.length > 0) {
		textstring += (properties.editors.length > 1 ? "Eds. " : "Ed. ") + formatNameList(properties.editors) + ". ";
	}

	textstring += properties.placePublished + ": ";
	textstring += properties.publisher + ", ";
	textstring += properties.year + ". ";

	textstring += properties.url;

	return textstring;
}

function copyCitation(properties) {
	var s = toFormatted(properties);
	var c = document.getElementById("copyarea");
	c.textContent = s;
	c.select();
	document.execCommand("copy");
	// setTimeout(function() {document.execCommand("copy");}, 200);
}

// FUNCTIONS DESIGNED TO BE RUN IN WEBPAGE SCOPE (FROM EXTENSION)

// function parseUrl() {
// 	var u = new URL(window.location.href);
// 	if (u.protocol != "devtools:") {
//         if (u.hostname === "www.uptodate.com" && document.getElementsByTagName("article").length > 0) {
//             chrome.runtime.sendMessage({
//                 message: {text: "activate"}
//             });
//             console.log("Activate message sent.");
//         }
//         else {
//             chrome.runtime.sendMessage({
//                 message: {text: "deactivate"}
//             });
//             console.log("Deactivate message sent.");
//         }
//     }
// }

// function saveFcn() {
// 	var articles = document.getElementsByTagName("article");

// 	if (articles.length == 0) {
// 		alert("Something went wrong. This is not a an UpToDate page with an article.");
// 		return;
// 	}
// 	else{
// 		var properties = new Object();

// 		properties.title = document.getElementById("topicTitle").innerText;
		
// 		var dl = document.getElementById("topicContributors");

// 		var contributors = new Object();
// 		contributors.current = "";
// 		[...dl.children].forEach(function(e) {
// 			elemtype = e.tagName.toLowerCase();
// 			if (elemtype == "dt") {
// 				key = e.innerText.replace(":","");
// 				key = key[key.length-1] == "s" ? key.slice(0, key.length-1) : key;
// 				contributors[key] = [];
// 				contributors.current = key; 
// 			}
// 			else if (elemtype == "dd") {
// 				name = e.innerText.split(",")[0]
// 				parts = name.split(" ");
// 				lastfirst = parts[parts.length-1] + ", " + parts.slice(0, parts.length-1).join(" ");
// 				contributors[contributors.current].push(lastfirst);
// 			}
// 		});
		
// 		properties.authors = contributors["Author"]
// 		properties.editors = [].concat("Post, Ted W", contributors["Section Editor"], contributors["Deputy Editor"])

// 		var yearRE = RegExp('20\\d{2}', 'g');
// 		matches = [...document.getElementById("literatureReviewDate").innerText.matchAll(yearRE)];
// 		properties.year = Math.max(...matches.map(m => m["0"]));

// 		properties.url = window.location.origin + window.location.pathname;

// 		const monthNames = ["January", "February", "March", "April", "May", "June",
// 			"July", "August", "September", "October", "November", "December"
// 		];
// 		var d = new Date();
// 		properties.accessDate = monthNames[d.getMonth()] + " " + d.getDate().toString() + ", " + d.getFullYear().toString();


// 		var infoRE = RegExp('Topic (\\d+) Version (\\d+\\.\\d+)', 'g');
// 		match = [...document.getElementById("topicVersionRevision").innerText.matchAll(infoRE)][0];
// 		properties.topicNumber = parseInt(match[1]);
// 		properties.version = parseFloat(match[2]);

// 		properties.bookTitle = "UpToDate";
// 		properties.placePublished = "Waltham, MA";
// 		properties.publisher = "UpToDate";

// 		chrome.runtime.sendMessage({
//             message: {text: "saveFile", payload: properties}
//         });
// 	}
// }

// THIS RUNS WHEN EXTENSION IS INITIALIZED

document.getElementById("saveButton").addEventListener("click", async() => {
	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		function: function() {
			document.getElementById("saveButton").click();
		},
	});
});

document.getElementById("copyButton").addEventListener("click", async() => {
	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		function: function() {
			document.getElementById("copyButton").click();
		},
	});
});

// make link open new chrome tab with link url
document.getElementById("infolink").addEventListener("click", async() => {
	chrome.tabs.create({url: document.getElementById("infolink").href});
});

chrome.runtime.onMessage.addListener(function(obj, sender, resp) {
	console.log("Message received: " + obj.message.text);
	// console.log(obj);
	switch(obj.message.text) {
		case "activate":
			activate();
			break;
		case "deactivate":
			deactivate();
			break;
		case "save":
			saveFile(obj.message.payload);
			break;
		case "copy":
			copyCitation(obj.message.payload);
			break;
	}
});

deactivate();

function requestValidity() {
	chrome.tabs.query({active: true, currentWindow: true}, (tablist) => {
		var [tab] = tablist;
		var u = new URL(tab.url);
		if (u.protocol != "chrome:") {
			// chrome.tabs.sendMessage(tab.id,
			// {
			//     message: {text: "reportValidity"}
			// });
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				function: function() {
					document.getElementById("reportButton").click();
				},
			});
		}
		else {
			// can't run scripts on chrome:// urls so don't bother
			deactivate();
		}
	});
}

requestValidity();


