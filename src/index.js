import { initMixin } from "./init"
import { initLicycle } from "./lifecycle" 

function Vue(options) {
    // debugger
    this._init(options)
}

initMixin(Vue)
initLicycle(Vue)



export default Vue