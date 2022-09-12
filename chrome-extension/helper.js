var extScripts = [];

function injectScript(fileName, resolve=null) {
    let injection = document.createElement("script");
    injection.src = chrome.runtime.getURL(fileName);

    injection.onload = () => { resolve ? resolve() : false; }

    (document.head || document.documentElement).appendChild(injection);

    return injection;
}

injectScript("extension.min.js");

const editorWaiter = new MutationObserver((mutations)=>{
    mutations.some((mutation)=>{
        const node = mutation.target.querySelector(".cke_toolbox");
        if (node) {
            editorWaiter.disconnect();

            const script = injectScript("extension.app.js");
            script.parentNode.removeChild(script);
            
            return true;
        }
    })
})

// https://phpcoder.tech/detect-url-change-in-javascript-without-refresh/
const URLobserver = new MutationObserver(() => {
    const isEdit = location.href.indexOf("edit-lesson") >= 0;
    const isNew = location.href.indexOf("step/new") >= 0;

    if ( (!previousIsEdit && isEdit) || (previousIsNew && isEdit) ) {
        editorWaiter.observe(document.body, config);
    }

    previousIsEdit = isEdit;
    previousIsNew = isNew;
});

const config = {childList: true, subtree: true};

var previousIsEdit = location.href.indexOf("edit-lesson") >= 0;
var previousIsNew = false;
if (previousIsEdit) {
    editorWaiter.observe(document.body, config);
}

URLobserver.observe(document, config)