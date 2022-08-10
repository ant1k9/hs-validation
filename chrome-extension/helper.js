function injectScript(fileName) {
    let injection = document.createElement("script");
    injection.src = chrome.runtime.getURL(fileName);

    (document.head || document.documentElement).appendChild(injection);
}

function injectImage(fileName, tag) {
    let buffer = document.querySelector("#hse-buffer");

    if (buffer === null) {
        buffer = document.createElement("div");
        buffer.id = "hse-buffer";
        document.body.appendChild(buffer);
    }

    buffer.setAttribute(tag, chrome.runtime.getURL(fileName));
}

const images = [
    {file: "icons/new-topic.png", tag: "newTopicIcon"}
];

const config = {childList: true, subtree: true};
const editorWaiter = new MutationObserver((mutations)=>{
    mutations.some((mutation)=>{
        const node = mutation.target.querySelector(".cke_toolbox");
        if (node) {
            editorWaiter.disconnect();

            injectScript("injection.js");
            injectScript("inject_class.js");

            for (let img of images) {
                injectImage(img.file, img.tag);
            }

            return true;
        }
    })
})

editorWaiter.observe(document.body, config);