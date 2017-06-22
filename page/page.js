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
  item.classList.add("tabItem");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "checkbox-" + tab.id;
  checkbox.classList.add("tabCheckbox");
  checkbox.name = tab.id;
  // checkbox.value is unset, so default value "on" will be sent
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
  img.classList.add("tabFavicon")
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

function moveSelectedTabs() {
  // Get ID of target window
  let windowPicker = document.getElementById("windowPicker");
  let targetId = windowPicker[windowPicker.selectedIndex].value;

  if (targetId === "new") { 
    console.log("Can't move to new window yet!");
    return;
  } else {
    targetId = parseInt(targetId);
  }

  // Get checked boxes
  let checkedBoxes = document.getElementsByTagName("input");
  for (let box of checkedBoxes) {
    if (box.checked){
      var moving = browser.tabs.move(parseInt(box.name), {windowId: targetId, index: -1}); 
    }
  }
}

function onMoved(tab) {
  console.log(`Moved: ${tab}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

window.onload = function() {
  var currWindowTabs = browser.tabs.query({});
  currWindowTabs.then(addTabs, onError);

  document.getElementById("moveSelectedBtn").addEventListener("click", moveSelectedTabs);

  console.log("Done");
};
