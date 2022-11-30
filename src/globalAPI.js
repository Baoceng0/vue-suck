import { mergeOptions } from "./utils";

export function initGlobalAPI(Vue) {
    Vue.options = {};
    // mergeField("haha")
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    }

}