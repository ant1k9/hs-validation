class StepikHelper {
    constructor () {
        this.app = this.getEmberApplication();
        if (!this.app) {
            console.error("Ember app was not found");
            return null;
        }

        this.ckInstance = this.getCkInstanceName();
        if (!this.ckInstance) {
            console.error("CKEDITOR app was not found");
            return null;
        }

        this.buffer = document.querySelector("#hse-buffer");
        if (!this.buffer) console.warn("Buffer not found");
        
        this._editor = undefined;
        this.initStack = [];

        this.router = this.app.__container__.lookup("router:main");
        this.ckConfig = CKEDITOR.instances[this.ckInstance].config;

        this.ckConfig.autoUpdateElement = true;
    }

    set editor(value) {
        this._editor = value;
        for (let cmd of this.initStack) cmd();
    }
    get editor() {
        return this._editor;
    }

    // https://stackoverflow.com/questions/41620545/how-does-ember-inspector-get-the-data-from-the-app
    getEmberApplication() {
        for (let i in Ember.Namespace.NAMESPACES) {
            if (Ember.Namespace.NAMESPACES[i] instanceof Ember.Application) {
                return Ember.Namespace.NAMESPACES[i]
            }
        }
        
        return false;
    }

    getCkInstanceName() {
        if (CKEDITOR) {
            return Object.keys(CKEDITOR.instances)[0];
        } else {
            return false;
        }
    }

    addToolbar(name, items) {
        this.ckConfig.toolbar_StepEditToolbar.push({
            name: name, items: [...items]
        });
    }

    addExtraPlugin(name) {
        let tmp = this.ckConfig.extraPlugins.split(",");
        tmp.push(name);

        this.ckConfig.extraPlugins = tmp.join(",");
    }

    addCommand(name, options={}) {
        const _this = this;
        const cmd = function () {
            _this.editor.addCommand(name, options);
        }

        if (this.editor === undefined) {
            this.initStack.push(cmd);
        } else {
            cmd();
        }
    }

    addButton(name, options={}) {
        options.icon = options.icon
            ? this.buffer
                ? this.buffer.getAttribute(options.icon)
                : ""
            : "";
        options.command = options.command
            ? options.command
            : "";
        options.toolbar = options.toolbar + ", 100";
        const _this = this;
        const cmd = function () {
            _this.editor.ui.addButton(name, options);
        }
        
        if (this.editor === undefined) {
            this.initStack.push(cmd);
        } else {
            cmd();
        }
    }

    addCombo(name, options={}) {
        options["multiSelect"] = false;
        options["panel"] = {
            css: [
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/skins/moono-lisa/editor.css?t=1659339237",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/ckeditor-iframe-styles.css?t=1659339237",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/rich-text-editor-content.css?t=1659339237",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/plugins/copyformatting/styles/copyformatting.css",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/../katex/katex.css?t=1659339237",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/../highlightjs/styles/googlecode.css?t=1659339237",
                "https://stepik.azureedge.net/static/frontend-build/ckeditor/plugins/copyformatting/styles/copyformatting.css"
            ]
        };

        const _this = this;
        const cmd = function () {
            _this.editor.ui.addRichCombo(name, options);
        }
        
        if (this.editor === undefined) {
            this.initStack.push(cmd);
        } else {
            cmd();
        }
    }

    getStep(num) {
        let store = this.app.__container__.lookup('service:store');
        let steps = store.peekAll("step-source");

        for (let i in steps.content) {
            let tmp = store.peekRecord("step-source", steps.content[i].id);
            
            if (tmp.position == num) {
                return tmp
            }
        }
    
        return false;
    }

    getActiveStep() {
        let loc = this.router.currentURL.split("/");
        let active = loc[loc.length-1];

        return this.getStep(active);
    }

    countMathTex = (str) => ([...str.matchAll(/<span class="math-tex">/g)].length);

    start() {
        if (this.editor !== undefined) {
            console.warn("Editor is already exists");
            return false;
        }
        
        const _this = this;

        CKEDITOR.instances[this.ckInstance].destroy(false);
        this.editor = CKEDITOR.replace(this.ckInstance, this.ckConfig);

        this.bindOnChange();

        this.router.addObserver("url", (ev)=>{
            setTimeout(()=>{
                _this.editor.setData(_this.getActiveStep().block.text);
            }, 1)
        })
    }

    bindOnChange() {
        const t = this.editor.on("change", this._changeListener.bind(this));
        this.unbindOnChange = async () => {
            await t.removeListener();
        };
    }

    updateContent() {
        (async ()=>(await this.editor.getData()))()
        .then(result=>{
            this.editor.setData(result);
        })
    }

    _changeListener(ev) {
        const record = this.getActiveStep();
        record.block.text = this.editor.getData();
    }
}