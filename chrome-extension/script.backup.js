// const ckeName = Object.keys(CKEDITOR.instances)[0];
// const cfg = CKEDITOR.instances[ckeName].config;
const buffer = document.querySelector("#hse-buffer");

// cfg.toolbar_StepEditToolbar.push({
//     name: "hseditor",
//     items: ["hseditor", "newtopic", "templates"]
// });

//     cfg.toolbar_StepEditToolbar.push({
//         name: "tools",
//         items: ["tools", "test1", "test2"]
//     });


// CKEDITOR.instances[ckeName].destroy(false);
// const editor = CKEDITOR.replace(ckeName, cfg);

// editor.addCommand("mySimpleCommand", {
//     exec: (editor)=>{
//         console.log(1);
//     }
// })

    // editor.ui.addButton('test1', {
    //     icon: "",
    //     label: "Test1",
    //     command: "",
    //     toolbar: "tools, 100"
    // });

// editor.ui.addButton('newtopic', {
//     icon: buffer.getAttribute("newTopicIcon"),
//     label: "New topic",
//     command: "mySimpleCommand",
//     toolbar: "hseditor, 100"
// });

// editor.ui.addRichCombo('templates', {
//     label: 'Templates',
//     title: 'Templates',
//     multiSelect: false,
//     init: function() {
//         console.log(this);
//         this.startGroup("Topic templates");
//         this.add("topicTemplate", "<h3>Topic</h3>", "Topic template");
//         this.add("compTemplate", "<h3>Comprehension</h3>", "Comprehension template");
//         this.add("appTemplate", "<h3>Application</h3>", "Application template");  
//     },
//     panel: {
//         css: [
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/skins/moono-lisa/editor.css?t=1659339237",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/ckeditor-iframe-styles.css?t=1659339237",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/rich-text-editor-content.css?t=1659339237",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/plugins/copyformatting/styles/copyformatting.css",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/../katex/katex.css?t=1659339237",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/../highlightjs/styles/googlecode.css?t=1659339237",
//             "https://stepik.azureedge.net/static/frontend-build/ckeditor/plugins/copyformatting/styles/copyformatting.css"
//         ]
//     },
//     onClick: function (value) {
//         editor.focus();
//         editor.fire('saveSnapshot');
//         editor.insertHtml(value);
//         editor.fire('saveSnapshot');
//     }
// });

// https://stackoverflow.com/questions/41620545/how-does-ember-inspector-get-the-data-from-the-app
function getApplication() {
    for (let i in Ember.Namespace.NAMESPACES) {
        if (Ember.Namespace.NAMESPACES[i] instanceof Ember.Application) {
            return Ember.Namespace.NAMESPACES[i]
        }
    }
    
    return false;
}

// https://stackoverflow.com/questions/31647559/how-to-get-the-router-instance-in-initializer
// https://stackoverflow.com/questions/28759015/how-to-access-a-known-ember-component-from-console
function getEditorComponent(app) {
    let instances = app.__container__.lookup("-view-registry:main");
    for (let key in instances) {
        let attrs = Object.keys(instances[key].attrs);
        if (attrs.indexOf("editorOptions") > -1) {
            return instances[key];
        }
    }

    return false;
}

const app = getApplication();
const router = app.__container__.lookup("router:main");
const editorComponent = getEditorComponent(app);
const editor = editorComponent._editor;

function getRecord(num) {
    let store = app.__container__.lookup('service:store');
    let steps = store.peekAll("step-source");

    return store.peekRecord("step-source", steps.content[num].id)
}


editor.config.toolbar_StepEditToolbar.push({
    name: "hseditor",
    items: ["hseditor", "newtopic", "templates"]
});

editor.ui.addButton('newtopic', {
    icon: buffer.getAttribute("newTopicIcon"),
    label: "New topic",
    command: "mySimpleCommand",
    toolbar: "hseditor, 100"
});

editorComponent.rerender();
// Router:
// Ember.Namespace.NAMESPACES[1].__container__.lookup("router:main").transitionTo("/edit-lesson/747696/step/3");
// Models:
// app.__container__.lookup("container-debug-adapter:main").catalogEntriesByType("model")