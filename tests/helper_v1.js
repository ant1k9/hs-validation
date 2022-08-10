class HSEHelper {
    constructor() {
        this.root = document.createElement("div");
        this.shadow = document.createElement("div");
        this.onStart = true;

        this.root.id = "hse-helper";
        this.shadow.id = "hse-shadow";

        this.pointer = { dx: 0, dy: 0 }

        this.observers();
    }

    observers() {
        const _this = this;

        const config = {childList: true, subtree: true};
        const iframeWait = new MutationObserver((mutations)=>{
            mutations.some((mutation)=>{
                if (mutation.addedNodes) {
                    const node = mutation.target.querySelector("iframe");
                    
                    if (node) {
                        iframeWait.disconnect();
                        _this.editNode = node;

                        node.addEventListener("load", (ev)=>{
                            _this.init();
                        })
                        
                        return true
                    }
                }
            })
        });

        var currentLocation = document.location.href
        const locationWatcher = new MutationObserver((mutations)=>{
            mutations.forEach((mutation)=>{
                if (document.location.href != currentLocation) {
                    currentLocation = document.location.href;
                    
                    if (currentLocation.indexOf("edit-lesson") > -1) {
                        iframeWait.observe(document.body, config);
                    } else {
                        _this.hide();
                    }
                }
            })
        })

        iframeWait.observe(document.body, config);
        locationWatcher.observe(document.body, config);
    }

    init() {
        if (document.location.pathname.indexOf("edit-lesson") == -1) return false;

        document.body.appendChild(this.root);
        document.body.appendChild(this.shadow);

        if (this.onStart) {
            this.root.innerHTML = this.template();

            this.header = this.root.querySelector(".hse-h-header");
            this.topicTmpButton = this.root.querySelector("button[action=newTopic]");
            this.compTmpButton = this.root.querySelector("button[action=newComprehension]");
            this.appTmpButton = this.root.querySelector("button[action=newApplication]");

            this.bindWindowActions();
            this.bindActions();

            this.onStart = false;
        }
    }

    hide() {
        if (this.root.parentNode) document.body.removeChild(this.root);
        if (this.shadow.parentNode) document.body.removeChild(this.shadow);
    }

    bindWindowActions() {
        const _this = this;

        function moveElem(ev) {
            _this.root.setAttribute("style", `
                left: ${ev.clientX + _this.pointer.dx}px; 
                top: ${ev.clientY + _this.pointer.dy}px`);

            let xy = boundsXY(_this.root, 10);

            _this.root.setAttribute("style", `left: ${xy[0]}px; top: ${xy[1]}px`)
        }

        function boundsXY(elem, pad=0) {
            const maxWidth = document.body.clientWidth - pad;
            const maxHeight = window.innerHeight - pad;

            const rect = elem.getBoundingClientRect();

            var result = [rect.x, rect.y];
            
            if (rect.x < pad) result[0] = pad;
            if (rect.x+rect.width > maxWidth) result[0] = maxWidth - rect.width;
            if (rect.y < pad) result[1] = pad;
            if (rect.y+rect.height > maxHeight) result[1] = maxHeight - rect.height;
            
            return result;
        }

        this.header.addEventListener("mousedown", (ev)=>{
            this.pointer.dx = this.header.getBoundingClientRect().x - ev.clientX;
            this.pointer.dy = this.header.getBoundingClientRect().y - ev.clientY;

            this.shadow.classList.add("active");
            window.addEventListener("mousemove", moveElem);
        });

        window.addEventListener("mouseup", (ev)=>{
            this.shadow.classList.remove("active");
            window.removeEventListener("mousemove", moveElem);
        });
        document.body.addEventListener("mouseleave", (ev)=>{
            this.shadow.classList.remove("active");
            window.removeEventListener("mousemove", moveElem);
        }); 
    }

    bindActions() {
        this.topicTmpButton.addEventListener("click", (ev)=>{
            this.editNode.contentWindow.document.body.innerHTML = this.newTopicTemplate;
        })
        this.compTmpButton.addEventListener("click", (ev)=>{
            this.editNode.contentWindow.document.body.innerHTML = this.newComprehensionTemplate;
        })
        this.appTmpButton.addEventListener("click", (ev)=>{
            this.editNode.contentWindow.document.body.innerHTML = this.newApplicationtemplate;
        })
    }

    template() {
        return `
        <div class="hse-h-header">
            <div class="hse-h-minimize hse-h-control"></div>
            <div class="hse-h-hide hse-h-control"></div>
        </div>
        <div class="hse-h-main">
            <button action="newTopic">Topic structure</button>
            <button action="newComprehension">Comprehension structure</button>
            <button action="newApplication">Application structure</button>
        </div>
        `
    }

    newTopicTemplate = `
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

    newComprehensionTemplate = `
        <p>[TITLE] ? # Comprehension [/TITLE]</p>
        <p>[META]Text[/META]</p>
    `;

    newApplicationtemplate = `
        <p>[TITLE] ? # Application [/TITLE]</p>
        <p>[META]Text[/META]</p>
    `;
}

const helper = new HSEHelper();