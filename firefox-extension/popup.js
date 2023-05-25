const updatePopup = function (startIndex = 0, type = undefined) {
  return async function (res) {
    let body = encodeURIComponent(res[0]);
    if (type !== undefined) body += `&type=${type}`;
    const data = await fetch(
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
    ).then(response => response.json());
    let list = document.createElement("div");
    for (var i = startIndex, len = data.errors.length; i < len; i++) {
      let child = document.createElement("div");
      child.innerHTML = data.errors[i];
      list.append(child);
    }
    document.getElementById("spinner").hidden = true;
    document.getElementById("text-container").innerHTML = list.innerHTML;
  }
}

const validateTopic = function() {
  browser.tabs.query(
    { active: true, windowId: browser.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      if (tabs[0].url.match(/.*(stepik|cogniterra).org.*\/step\/1([^\d]|$)/))
        browser.tabs.executeScript(
          tabs[0].id, {
            code: "document.getElementsByClassName('html-content')[0].getElementsByTagName('span')[0].innerHTML"
          }).then(updatePopup(0, "theory"))
      else if (tabs[0].url.match(/.*(stepik|cogniterra).org.*\/step\/\d+/))
        browser.tabs.executeScript(
          tabs[0].id, {
            code: `var description = document.getElementsByClassName('html-content')[0].getElementsByTagName('span')[0].innerHTML + '\\n';
            var optionsContainer = document.createElement('div');
            var testOptions = document.getElementsByClassName('choice-quiz-show__option');
            for (let i = 0, len = testOptions.length; i < len; i++) {
              optionsContainer.append(testOptions[i].cloneNode(true));
              optionsContainer.innerHTML += '\\n'
            }
            description + optionsContainer.innerHTML`
          }).then(updatePopup(0, "task"))
      else if (tabs[0].url.match(/.*hyperskill.org/))
        browser.tabs.executeScript(tabs[0].id, {
          code: `let dataSections = document.querySelectorAll('div[data-section]');
            let contentBody = document.createElement("div");
            for (let i = 1, len = dataSections.length; i < len; i++) {
              contentBody.append(dataSections[i].cloneNode(true));
            }
            contentBody.innerHTML.replaceAll('</h2>', '</h2>\n').replaceAll('<br>', '<br>\n')`
        }).then(updatePopup(1))
    }
  )
}

const validateProject = function() {
  browser.tabs.query(
    { active: true, windowId: browser.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      if (tabs[0].url.match(/.*(stepik|cogniterra).org.*\/step\/1([^\d]|$)/))
        browser.tabs.executeScript(
          tabs[0].id, {
            code: "document.getElementsByClassName('html-content')[0].getElementsByTagName('span')[0].innerHTML"
          }).then(updatePopup(0, "projectDescription"))
      else if (tabs[0].url.match(/.*(stepik|cogniterra).org.*\/step\/\d+/))
        browser.tabs.executeScript(
          tabs[0].id, {
            code: "document.getElementsByClassName('html-content')[0].getElementsByTagName('span')[0].innerHTML"
          }).then(updatePopup(0, "projectStage"))
    }
  )
}

const validate = function() {
  browser.storage.local.get(['projectMode']).then(result => {
    if (result.projectMode) validateProject();
    else validateTopic();
  });
}

const loadSettings = function() {
  const checkbox = document.getElementById('project-mode')
  browser.storage.local.get(['projectMode']).then(result => {
    if (result.projectMode) checkbox.setAttribute('checked', true);
  });

  checkbox.addEventListener('change', (event) => {
    browser.storage.local.set({projectMode: event.target.checked});
  });
}

/* call on load */
loadSettings();
validate();
