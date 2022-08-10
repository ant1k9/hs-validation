function injectScript(fileName, resolve=null) {
    let injection = document.createElement("script");
    injection.src = chrome.runtime.getURL(fileName);

    injection.onload = () => { resolve ? resolve() : false; }

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
    {file: "icons/new-topic.png", tag: "newTopicIcon"},
    {file: "icons/percent.png", tag: "percent"}
];

const config = {childList: true, subtree: true};
const editorWaiter = new MutationObserver((mutations)=>{
    mutations.some((mutation)=>{
        const node = mutation.target.querySelector(".cke_toolbox");
        if (node) {
            editorWaiter.disconnect();

            new Promise(resolve => {
                injectScript("inject_class.js", resolve);
            }).then(()=>{
                injectScript("injection.js");
            })

            for (let img of images) injectImage(img.file, img.tag);

            return true;
        }
    })
})

editorWaiter.observe(document.body, config);