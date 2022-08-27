function select(selector, all = false) {
    if (all) return [...document.querySelectorAll(selector)];
    return document.querySelector(selector);
}

function randomString(len = 10, prefix = "") {
    let str = "";
    for (let i = 0; i < len; i++) {
        str += Math.floor(Math.random() * 16).toString(16);
    }
    str = prefix + str;
    return str.trim();
}

function addMethod(name, callback) {
    HTMLElement.prototype[name] = callback;
}

addMethod("on", function (event, cb) {
    this.addEventListener(event, cb);
});

addMethod("inlineStyle", function (styles) {
    for (let [property, value] of Object.entries(styles)) {
        this.style[property] = value;
    }
});

addMethod("setAspect", function (x = 16, y = 9) {
    // when the user resize the window
    // it will recalculate the aspect base on the element width
    // by default the aspect is set 16 by 9
    window.addEventListener("resize", () => {
        _setAspect(this);
    });
    _setAspect(this);
    function _setAspect(el) {
        const height = (el.clientWidth / x) * y;
        el.style.height = `${Math.round(height)}px`;
    }
});

addMethod("setAttr", function (attributes) {
    for (let [attr, value] of Object.entries(attributes)) {
        this.setAttribute(attr, value);
    }
});

function classes(el, action, ..._classes) {
    _classes.forEach((cls) => {
        el.classList[action](cls);
    });
}

addMethod("addClass", function (...classNames) {
    classes(this, "add", ...classNames);
});

addMethod("removeClass", function (...classNames) {
    classes(this, "remove", ...classNames);
});

addMethod("toggleClass", function (...classNames) {
    classes(this, "toggle", ...classNames);
});

addMethod("hasClass", function (targetedClass) {
    return this.classList.contains(targetedClass);
});

addMethod(
    "insertElement",
    function ({ tagName = "div", attr = {}, insert = "last", children = [] }) {
        const element = document.createElement(tagName);
        let identifier = "__" + randomString();
        // generate a uniq identifier to get the element from the DOM
        // after it's rendered
        attr["data-uniq-id"] = identifier;

        // Add the attributes to the element
        element.setAttr(attr);
        // add children if exist
        children.length > 0 && element.append(...children);
        // where toi insert the element
        switch (insert) {
            // insert as a first child
            case "first":
                this.prepend(element);
                break;
            // insert as a last child
            case "last":
                this.append(element);
                break;
            // insert before the element it was call on
            case "before":
                this.before(element);
                break;
            // insert after the element
            case "after":
                this.after(element);
                break;
        }
        // select the element after it's been rendered to the DOM
        // and remove the identifier than return it
        let renderedElement = select(`[data-uniq-id="${identifier}"]`);
        renderedElement.removeAttribute("data-uniq-id");
        return renderedElement;
    }
);
