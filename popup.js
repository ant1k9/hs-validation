const updatePopup = function(startIndex = 0, type = undefined) {
  return function(res) {
    let body = encodeURIComponent(res[0].result);
    if (type !== undefined) body += `&type=${type}`;

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
        "body": `text=${body}`,
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
      if (tabs[0].url.match(/.*stepik.org.*\/step\/1([^\d]|$)/))
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
      else if (tabs[0].url.match(/.*stepik.org.*\/step\/\d+/))
        chrome.scripting.executeScript(
          {
            target: {tabId: tabs[0].id},
            function: () => {
              let description = document.
                getElementsByClassName('html-content')[0].
                getElementsByTagName('span')[0].
                innerHTML + '\n';
              let optionsContainer = document.createElement('div');
              let testOptions = document.getElementsByClassName("choice-quiz-show__option");
              for (let i = 0, len = testOptions.length; i < len; i++) {
                optionsContainer.append(testOptions[i].cloneNode(true));
                optionsContainer.innerHTML += '\n'
              }
              return description + optionsContainer.innerHTML
            }
          },
          updatePopup(0, {type: "task"}),
        );
      else if (tabs[0].url.match(/.*hyperskill.org/))
        chrome.scripting.executeScript(
          {
            target: {tabId: tabs[0].id},
            function: () => {
              let dataSections = document.querySelectorAll('div[data-section]');
              let contentBody = document.createElement("div");
              for (let i = 1, len = dataSections.length; i < len; i++) {
                contentBody.append(dataSections[i].cloneNode(true));
              }
              return contentBody.innerHTML.
                replaceAll('</h2>', '</h2>\n').
                replaceAll('<br>', '<br>\n');
            }
          },
          updatePopup(1),
        );
    }
  )
}

/* call on load */
validate();
