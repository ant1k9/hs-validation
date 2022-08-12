const helper = new StepikHelper();

helper.addToolbar(
    "hseditor",
    ["hseditor", "newtopic", "templates", "mathtex"]
);

const mathTexStyle = new CKEDITOR.style({
    element: "span",
    attributes: { "class": "math-tex" }
});

// var mathTexStyleCommand = new CKEDITOR.styleCommand(mathTexStyle);

// helper.addCommand(
//     "mathTexStyle",
//     mathTexStyleCommand
// );

helper.addCommand("mathTexStyle", {
    exec: (editor) => {
        helper.unbindOnChange()
            .then(()=>{
                selection = editor.getSelection().getNative();
                html = `<span class="math-tex">${selection}</span>`;
                elem = CKEDITOR.dom.element.createFromHtml(html, editor.document);
                
                editor.insertElement(elem);
            })
            .then(()=>(
                (async () => helper.updateContent())()
            ))
            .then(()=>{
                // prevent doubled update
                // KOSTYL'
                setTimeout(()=>{
                    helper.bindOnChange()
                }, 1);
            });
    }
})

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
        value = (value == "topicTemplate")
            ? newTopicTemplate
            : (value == "compTemplate")
                ? newComprehensionTemplate
                : newApplicationtemplate;
        
        helper.editor.focus();
        helper.editor.fire('saveSnapshot');
        helper.editor.insertHtml(value);
        helper.editor.fire('saveSnapshot');
    }
})

helper.start();

// helper.editor.getSelection().getRanges()[0].cloneContents().$

const newTopicTemplate = `
    <p>[PRE]</p>
    <ul>
        <li><a href="#" rel="noopener noreferrer nofollow">?</a></li>
    </ul>
    <p>Group: Golang -- ?</p>
    <p>[/PRE]</p>
    <p>
        [META]Intro section[/META]
    </p>
    <h2>Section 1</h2>
    <p>[META]Text[/META]</p>
    <h2>Section 2</h2>
    <p>[META]Text[/META]</p>
    <h2>Section 3</h2>
    <p>[META]Text[/META]</p>
    <h2>Conclusion</h2>
    <p>[META]Text[/META]</p>
    <ul>
        <li>...</li>
    </ul>`;

const newComprehensionTemplate = `
    <p>[TITLE] ? # Comprehension [/TITLE]</p>
    <p>[META]Text[/META]</p>
    `;

const newApplicationtemplate = `
    <p>[TITLE] ? # Application [/TITLE]</p>
    <p>[META]Text[/META]</p>
    `;