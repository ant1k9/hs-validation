const helper = new StepikHelper();

helper.addToolbar(
    "hseditor",
    ["hseditor", "newtopic", "templates", "mathtex"]
);

const mathTexStyle = new CKEDITOR.style({
    element: "span",
    attributes: { "class": "math-tex" }
});

var mathTexStyleCommand = new CKEDITOR.styleCommand(mathTexStyle);

helper.addCommand(
    "mathTexStyle",
    mathTexStyleCommand
);

helper.addButton("mathtex", {
        icon: "percent",
        label: "Inline math-tex",
        command: "mathTexStyle",
        toolbar: "hseditor"
    }
);

helper.addCombo("templates", {
    label: 'Templates',
    title: 'Templates',
    init: function() {
        "use strict";
        
        this.startGroup("Topic templates");
        this.add("topicTemplate", "<h3>Topic</h3>", "Topic template");
        this.add("compTemplate", "<h3>Comprehension</h3>", "Comprehension template");
        this.add("appTemplate", "<h3>Application</h3>", "Application template");  
    },
    onClick: function (value) {
        helper.editor.focus();
        helper.editor.fire('saveSnapshot');
        helper.editor.insertHtml(value);
        helper.editor.fire('saveSnapshot');
    }
})

helper.start();

// helper.editor.getSelection().getRanges()[0].cloneContents().$