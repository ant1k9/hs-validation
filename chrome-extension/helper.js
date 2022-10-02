function injectScript(fileName, resolve=null) {
    let injection = document.createElement("script");
    injection.src = chrome.runtime.getURL(fileName);

    injection.onload = () => { resolve ? resolve() : false; }

    (document.head || document.documentElement).appendChild(injection);

    return injection;
}

injectScript('bundle.min.js');