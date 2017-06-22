function openPage() {
  browser.tabs.create({
    url: "page/page.html"
  });
}

browser.browserAction.onClicked.addListener(openPage);
