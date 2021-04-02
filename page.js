function reportValidity() {
    var u = new URL(window.location.href);
    if (u.protocol != "devtools:") {
        if (u.hostname === "www.uptodate.com" && document.getElementsByTagName("article").length > 0) {
            document.dispatchEvent(new CustomEvent("extensionMessage", {
                detail: {message: {text: "activate"}}
            }));
            console.log("Activate message sent.");
        }
        else {
            document.dispatchEvent(new CustomEvent("extensionMessage", {
                detail: {message: {text: "deactivate"}}
            }));
            console.log("Deactivate message sent.");
        }
    }
}

function parseProperties() {
    var properties = new Object();

    properties.title = document.getElementById("topicTitle").innerText;
    
    var dl = document.getElementById("topicContributors");

    var contributors = new Object();
    contributors.current = "";
    [...dl.children].forEach(function(e) {
        elemtype = e.tagName.toLowerCase();
        if (elemtype == "dt") {
            key = e.innerText.replace(":", "");
            key = key[key.length-1] == "s" ? key.slice(0, key.length-1) : key;
            contributors[key] = [];
            contributors.current = key;
        }
        else if (elemtype == "dd") {
            name = e.innerText.split(",")[0];
            parts = name.split(" ");
            lastfirst = parts[parts.length-1] + ", " + parts.slice(0, parts.length-1).join(" ");
            contributors[contributors.current].push(lastfirst);
        }
    });
    
    properties.authors = contributors["Author"];
    properties.editors = [].concat("Post, Ted W", contributors["Section Editor"], contributors["Deputy Editor"]);

    var yearRE = RegExp('20\\d{2}', 'g');
    matches = [...document.getElementById("literatureReviewDate").innerText.matchAll(yearRE)];
    properties.year = Math.max(...matches.map(m => m["0"]));

    properties.url = window.location.origin + window.location.pathname;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var d = new Date();
    properties.accessDate = monthNames[d.getMonth()] + " " + d.getDate().toString() + ", " + d.getFullYear().toString();

    var infoRE = RegExp('Topic (\\d+) Version (\\d+\\.\\d+)', 'g');
    match = [...document.getElementById("topicVersionRevision").innerText.matchAll(infoRE)][0];
    properties.topicNumber = parseInt(match[1]);
    properties.version = parseFloat(match[2]);

    properties.bookTitle = "UpToDate";
    properties.placePublished = "Waltham, MA";
    properties.publisher = "UpToDate";

    return properties
}

function retreiveProperties(action) {
    var articles = document.getElementsByTagName("article");

    if (articles.length == 0) {
        alert("Something went wrong. This is not a an UpToDate page with an article.");
        return;
    }
    else{
        var properties = parseProperties();
        document.dispatchEvent(new CustomEvent("extensionMessage", {
            detail: {message: {text: action, payload: properties}}
        }));
    }
}

function saveCitation() {
    retreiveProperties("save");
}

function copyCitation() {
    retreiveProperties("copy");
}

// bind these functions to document so they will be accessible in content script
function makeButtons() {
    var b = document.createElement("button");
    b.id = "reportButton";
    b.onclick = reportValidity;
    b.style = "display: none;";

    var s = document.createElement("button");
    s.id = "saveButton";
    s.onclick = saveCitation;
    s.style = "display: none;";

    var c = document.createElement("button");
    c.id = "copyButton";
    c.onclick = copyCitation;
    c.style = "display: none;";

    document.head.appendChild(b);
    document.head.appendChild(s);
    document.head.appendChild(c);
}

makeButtons();
