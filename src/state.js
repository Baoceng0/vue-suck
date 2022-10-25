import { observe } from "./observe/index.js";
export function initState(vm) {
    const ops = vm.$options;
    if(ops.data){
        initData(vm);
    }
}

function proxy(vm,target,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[target][key];
        },
        set(newVal){
            console.log("lai zhi le2");
            vm[target][key] = newVal;
        }
    });
}

function initData(vm){
    let data = vm.$options.data;
    // debugger
    data = typeof data === 'function'? data.call(vm) : data;

    // console.log(data);
    vm._data = data
    // Vue2 data observer
    observe(data)


    // encapsulate vm._data ---> vm
    for(let key in data){
        proxy(vm,'_data',key);
    }
}