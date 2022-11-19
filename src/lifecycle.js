import { createElement, createTextVNode } from "./vdom";

function patchProps(el, props) {
    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName];
            }
        } else {
            el.setAttribute(key, props[key]);
        }
    }
}

function createElm(vnode) {
    let [tag, data, children, text] = vnode;
    console.log("data",data);
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag); // mount real element onto vnode

        patchProps(vnode.el, data);

        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function patch(oldVnode, newVnode) {
    console.log("oldVnode", oldVnode);
    // first time 
    const isRealEl = oldVnode.type;
    console.log("isRealEl", isRealEl);
    if (isRealEl) {
        console.log("new", newVnode);
        const elm = oldVnode;

        const parentElm = elm.parentNode;

        let newElm = createElm(newVnode);

        parentElm.insertBefore(newElm, elm.nextSibling);

        parentElm.removeChild(elm);

        return newElm;
    } else {
        // diff algorithm 
    }

}

export function initLicycle(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const el = vm.$el;
        console.log("update", vnode);
        // console.log(el);

        // initialize and update DOM
        // vnode -> dom
        vm.$el = patch(vnode, el);
        console.log('el', el);

    };
    Vue.prototype._c = function () {
        return createElement(this, ...arguments);
    };
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments);
    };
    Vue.prototype._s = function (value) {
        if (typeof value !== 'object') return value;
        return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
        const vm = this;
        return vm.$options.render.call(vm);
    }
}
export function mountComponent(vm, el) {
    vm.$el = el

    //1 create Vnode by render()
    vm._update(vm._render())

    //2 VDOM -> DOM
    //3 insert DOM into el
}