import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;


class Watcher {
    constructor(vm, fn, options) {
        this.id = id++;
        this.renderWatcher = options;
        this.getter = fn;
        this.deps = [];
        this.depsId = new Set();
        this.get();
    }

    get() {
        pushTarget(this);
        this.getter()
        popTarget();
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(dep.id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }

    update() {
        // console.log("update");
        // this.get();  // 立即更新性能不好，异步一下
        queueWatcher(this); // cacher the watcher
    }

    run() {
        console.log("run");
        this.get();
    }

}


let queue = [];
let has = {};
let pending = false;


function flushSchedulerQueue() {
    let flushQueue = queue.slice(0);
    flushQueue.forEach(q => q.run());
    queue = [];
    has = {};
    pending = false;

}

function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true;
        console.log("queue");

        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}

// function timerFun(){

// }
let timerFun;
if (Promise) {
    timerFun = () => {
        Promise.resolve().then(flushCabllbacks);
    }
} else if (MutationObserver) {
    let observe = new MutationObserver(flushCabllbacks);
    let textNode = document.createTextNode(1);
    observe.observe(textNode, {
        characterData: true
    });
    timerFun = () => {
        textNode.textContent = 2;
    }
} else if(setImmediate) {
    timerFun = () => {
        setImmediate(flushCabllbacks);
    }
} else {
    timerFun = () => {
        setTimeout(flushCabllbacks);
    }
}

let callbacks = [];
let waiting = false;

function flushCabllbacks() {
    waiting = false;
    let obs = callbacks.slice(0);
    callbacks = [];
    obs.forEach(cb => cb());
}
export function nextTick(cb) {
    // console.log(cb);
    callbacks.push(cb)
    if (!waiting) {
        timerFun();
        waiting = true;
    }
}

// 每个属性都需要dep


export default Watcher;