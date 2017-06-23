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
  var parent = document.getElementById("window-" + tab.windowId);
  if (parent === null) {
    parent = createWindowDiv(tab.windowId);
  }
  return parent;
}

function createWindowDiv(windowId) {
  var newWindow = document.createElement("div");
  newWindow.id = "window-" + windowId;
  newWindow.classList.add("window");
  document.getElementById("windowsContainer").appendChild(newWindow);

  var title = document.createElement("div");
  title.classList.add("windowTitle");
  var titleText = document.createElement("h2");
  titleText.textContent = "Window " + windowNumber;
  title.appendChild(titleText);
  newWindow.appendChild(title);

  var windowOpt = document.createElement("option");
  windowOpt.value = windowId;
  windowOpt.innerText = "Window " + windowNumber;
  document.getElementById("windowPicker").appendChild(windowOpt);

  windowNumber++;

  return newWindow;
}

function generateListItem(tab, parent) {
  var item = document.createElement("div");
  item.id = "item-" + tab.id;
  item.classList.add("tabItem");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "checkbox-" + tab.id;
  checkbox.classList.add("tabCheckbox");
  checkbox.name = tab.id;
  item.appendChild(checkbox);

  var img = document.createElement("img");
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

function moveTab(box, targetId) {
  console.log("Moving tab: " + box.name);
  if (box.checked) {
    return browser.tabs.move(parseInt(box.name), {
      windowId: targetId,
      index: -1
    });
  }
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

  // Get checked boxes
  const checkedBoxes = document.querySelectorAll(
    "input[type=checkbox]:checked"
  );
  // checkedBoxes is an htmlcollection, not an array
  // Via https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
  const checkedBoxesArr = Array.from(checkedBoxes);

  // Shoutout to https://gist.github.com/yesvods/01fbeeb39de2c9d16a0a
  let moves = checkedBoxesArr.map(box => moveTab(box, targetId));
  let results = await Promise.all(moves);

  console.log("After results");

  browser.tabs.reload();
}

function loadTabs() {
  var currWindowTabs = browser.tabs.query({});
  currWindowTabs.then(addTabs, onError);

  document
    .getElementById("moveSelectedBtn")
    .addEventListener("click", moveSelectedTabs);

  console.log("Loaded");
}

window.onload = loadTabs;
