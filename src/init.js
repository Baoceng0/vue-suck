import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = options;
        // console.log("3");
        // state initalizing...
        initState(vm);
        // console.log("2");
        // mount element
        if(options.el){
            console.log("1");
            vm.$mount(options.el);
        }
    }

    Vue.prototype.$mount = function(el){
        const vm = this
        el = document.querySelector(el);
        let options = vm.$options
        //priority: render > template > el
        if(!options.render){
            let template;
            if(!options.template && el){
                template = el.outerHTML;
            } else{
                if(el){
                    template = options.template;
                }
            }
            // console.log(template);
            if(template){
                const render = compileToFunction(template);
                options.render = render;
            }
        }
        options.render;
    }
}

