
function addTabs(tabs) {
    var tabsListNode = document.getElementById("tablist");

    tabTitleText = document.createTextNode("List of Tabs:");
    tabsListNode.appendChild(tabTitleText);

    for (let tab of tabs) {
        console.log(tab.title)
        var tabitem = document.createTextNode(tab.title);
        tabsListNode.appendChild(tabitem);
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}

var currWindowTabs = browser.tabs.query({currentWindow: true});
currWindowTabs.then(addTabs, onError)

console.log("Done")