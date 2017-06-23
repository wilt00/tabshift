// GLOBAL STATE
var windowNumber = 1;

// Drag selection example: https://codepen.io/netgfx/pen/twAfG
// Explanation: http://nightlycoding.com/index.php/2014/02/click-and-drag-multi-selection-rectangle-with-javascript/

function onMoved(tab) {
  console.log(`Moved: ${tab}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// Returns reference to div where given tab should go
// If this div doesn't exist, creates it and appends it to "windowsContainer"
// Parent div Id is of the form "window-[window Id]"
function getParent(tab) {
  let parent = document.getElementById("window-" + tab.windowId);
  if (parent === null) {
    parent = createWindowDiv(tab.windowId);
  }
  return parent;
}

function createWindowDiv(windowId) {
  const newWindow = document.createElement("div");
  newWindow.id = "window-" + windowId;
  newWindow.classList.add("window");
  document.getElementById("windowsContainer").appendChild(newWindow);

  const title = document.createElement("div");
  title.classList.add("windowTitle");
  const titleText = document.createElement("h2");
  titleText.textContent = "Window " + windowNumber;
  title.appendChild(titleText);
  newWindow.appendChild(title);

  const windowOpt = document.createElement("option");
  windowOpt.value = windowId;
  windowOpt.innerText = "Window " + windowNumber;
  document.getElementById("windowPicker").appendChild(windowOpt);

  windowNumber++;

  return newWindow;
}

// Question: Is this more efficient than using anonymous function at item creation time?
function itemClicked(event) {
  event.currentTarget.classList.toggle("tabItemSelected");
}

function generateListItem(tab, parent) {
  const item = document.createElement("div");
  item.id = "item-" + tab.id;
  item.classList.add("tabItem");
  item.onclick = itemClicked;
  item.dataset.tabId = tab.id;

  const img = document.createElement("img");
  img.src = tab.favIconUrl;
  if (img.src.endsWith("undefined")) {
    // TODO: Replace temp art
    // Credit: https://openclipart.org/detail/194751/globe
    img.src = "globe-300px.png";
  }
  img.width = "32";
  img.height = "32";
  img.classList.add("tabFavicon");
  item.appendChild(img);

  const itemText = document.createElement("span");
  itemText.classList.add("itemText");
  itemText.textContent = tab.title;
  item.appendChild(itemText);

  parent.appendChild(item);
}

function addTabs(tabs) {
  for (let tab of tabs) {
    generateListItem(tab, getParent(tab));
  }
}

function moveTab(item, targetId) {
  console.log("Moving tab: " + item.dataset.tabId);
  return browser.tabs.move(parseInt(item.dataset.tabId), {
    windowId: targetId,
    index: -1
  });
}

async function moveSelectedTabs() {
  // Get ID of target window
  const windowPicker = document.getElementById("windowPicker");
  let targetId = windowPicker[windowPicker.selectedIndex].value;

  if (targetId === "new") {
    // TODO: Create new window
    window.alert("Can't move to new window yet!");
    return;
  } else {
    targetId = parseInt(targetId);
  }

  const selectedItems = document.getElementsByClassName("tabItemSelected");
  // selectedItems is an htmlcollection, not an array
  // Via https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
  const selectedItemsArr = Array.from(selectedItems);

  // Shoutout to https://gist.github.com/yesvods/01fbeeb39de2c9d16a0a
  const moves = selectedItemsArr.map(item => moveTab(item, targetId));
  await Promise.all(moves);

  console.log("After results");

  browser.tabs.reload();
}

function loadTabs() {
  const currWindowTabs = browser.tabs.query({});
  currWindowTabs.then(addTabs, onError);

  document
    .getElementById("moveSelectedBtn")
    .addEventListener("click", moveSelectedTabs);

  console.log("Loaded");
}

window.onload = loadTabs;
