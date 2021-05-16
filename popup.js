const updatePopup = function(startIndex = 0) {
  return function(res) {
    fetch(
      "https://hyperservices.herokuapp.com/validation", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "body": `text=${encodeURIComponent(res[0].result)}`,
        "method": "POST",
      }
    ).then(response => response.json()).
      then(data => {
        let list = document.createElement("div");
        for (var i = startIndex, len = data.errors.length; i < len; i++) {
          let child = document.createElement("div");
          child.innerHTML = data.errors[i];
          list.append(child);
        }
        document.getElementById("spinner").hidden = true;
        document.getElementById("text-container").innerHTML = list.innerHTML
      }
      )
  }
}

const validate = function() {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      if (tabs[0].url.match(/.*stepik.org/))
        chrome.scripting.executeScript(
          {
            target: {tabId: tabs[0].id},
            function: () => document.
              getElementsByClassName('html-content')[0].
              getElementsByTagName('span')[0].
              innerHTML
          },
          updatePopup(),
        );
      if (tabs[0].url.match(/.*hyperskill.org/))
        chrome.scripting.executeScript(
          {
            target: {tabId: tabs[0].id},
            function: () => {
              let dataSections = document.querySelectorAll('div[data-section]');
              let contentBody = document.createElement("div");
              for (let i = 1, len = dataSections.length; i < len; i++) {
                contentBody.append(dataSections[i].cloneNode(true));
              }
              return contentBody.innerHTML.replaceAll('</h2>', '</h2>\n');
            }
          },
          updatePopup(1),
        );
    }
  )
}

/* call on load */
validate();
