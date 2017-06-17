
function generateListItem(tab, parent) {
    var item = document.createElement("li");
    item.classList.add("tabItem");

    var img = document.createElement("img");
    img.src = tab.favIconUrl;
    img.width = "32";
    img.height = "32";


    item.appendChild(img);
   
    item.appendChild(document.createTextNode(tab.title));

    parent.appendChild(item);
}

function addTabs(tabs) {
    var tabsListNode = document.getElementById("tabList");

    var tabTitleText = document.createTextNode("List of Tabs:");
    tabsListNode.appendChild(tabTitleText);

    for (let tab of tabs) {
        //console.log(tab.title)

        //var tabListItem = document.createElement("li");
        //tabListItem.innerText = tab.title;

        //tabsListNode.appendChild(tabListItem);

        generateListItem(tab, tabsListNode);
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}


window.onload = function () {
    var currWindowTabs = browser.tabs.query({currentWindow: true});
    currWindowTabs.then(addTabs, onError)

    console.log("Done")
}

