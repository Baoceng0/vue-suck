import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = options;
        initState(vm);
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
            if(template && el){
                const render = compileToFunction(template);
                options.render = render;
            }
        }
        // console.log(options.render);
        mountComponent(vm, el);
    }
}

