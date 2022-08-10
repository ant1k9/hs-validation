// https://stackoverflow.com/questions/41620545/how-does-ember-inspector-get-the-data-from-the-app
function getApplication() {
    for (let i in Ember.Namespace.NAMESPACES) {
        if (Ember.Namespace.NAMESPACES[i] instanceof Ember.Application) {
            return Ember.Namespace.NAMESPACES[i]
        }
    }
    
    return false;
}

function getRecord(num) {
    let store = app.__container__.lookup('service:store');
    let steps = store.peekAll("step-source");
    
    for (let i in steps.content) {
        let tmp = store.peekRecord("step-source", steps.content[i].id);
        
        if (tmp.position == num) {
            return tmp
        }
    }

    return false;
}

function getActiveRecord() {
    let loc = router.currentURL.split("/");
    let active = loc[loc.length-1];

    return getRecord(active);
}

const app = getApplication();
const router = app.__container__.lookup("router:main");

const ckeName = Object.keys(CKEDITOR.instances)[0];
const cfg = CKEDITOR.instances[ckeName].config;
const buffer = document.querySelector("#hse-buffer");



cfg.toolbar_StepEditToolbar.push({
    name: "hseditor",
    items: ["hseditor", "newtopic", "templates"]
});

CKEDITOR.instances[ckeName].destroy(false);
const editor = CKEDITOR.replace(ckeName, cfg);

editor.on("change", (ev)=>{
    const record = getActiveRecord();
    record.block.text = editor.getData();
})

router.addObserver("url", (ev)=>{
    setTimeout(()=>{
        editor.setData(getActiveRecord().block.text);
    }, 1)
})

editor.addCommand("mySimpleCommand", {
    exec: (editor)=>{
        console.log(1);
    }
})

editor.ui.addButton('newtopic', {
    icon: buffer.getAttribute("newTopicIcon"),
    label: "New topic",
    command: "mySimpleCommand",
    toolbar: "hseditor, 100"
});

// Router:
// Ember.Namespace.NAMESPACES[1].__container__.lookup("router:main").transitionTo("/edit-lesson/747696/step/3");
// Models:
// app.__container__.lookup("container-debug-adapter:main").catalogEntriesByType("model")