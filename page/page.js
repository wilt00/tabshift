
// GLOBAL STATE
var windowNumber = 1;

// Drag selection example: https://codepen.io/netgfx/pen/twAfG
// Explanation: http://nightlycoding.com/index.php/2014/02/click-and-drag-multi-selection-rectangle-with-javascript/

// Returns reference to div where given tab should go
// If this div doesn't exist, creates it and appends it to "windowsContainer"
// Parent div Id is of the form "window-[window Id]"
function getParent(tab) {
    var parent = document.getElementById("window-" + tab.windowId);
    if (parent === null) {
        parent = document.createElement("div");
        parent.id = "window-" + tab.windowId;
        parent.classList.add("window");
        document.getElementById("windowsContainer").appendChild(parent);

        var title = document.createElement("div");
        title.classList.add("windowTitle");
        var titleText = document.createElement("h2");
        titleText.textContent = "Window " + windowNumber;
        title.appendChild(titleText);
        parent.appendChild(title);
        windowNumber++;
    }
    return parent;
}


// TODO: move creation logic from getParent here
function createWindowDiv(windowId) {}


function generateListItem(tab, parent) {
    var item = document.createElement("div");
    item.classList.add("tabItem");

    var img = document.createElement("img");
    img.src = tab.favIconUrl;
    img.width = "32";
    img.height = "32";
    item.appendChild(img);
    
    var itemText = document.createElement("span");
    itemText.classList.add("itemText");
    itemText.textContent = tab.title;
    item.appendChild(itemText);

    parent.appendChild(item);
}


function addTabs(tabs) {
    for (let tab of tabs) {
        var parent = getParent(tab);
        generateListItem(tab, parent);
    }
}


function onError(error) {
    console.log(`Error: ${error}`);
}


window.onload = function () {
    var currWindowTabs = browser.tabs.query({});
    currWindowTabs.then(addTabs, onError);

    console.log("Done")
}

