let oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto);

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method=>{
    newArrayProto[method] = function(...args){
        const result = oldArrayProto[method].call(this, ...args)

        // console.log('me',method);
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        console.log(inserted);
        if(inserted){
            ob.observerArray(inserted);
        }
        return result;
    }
})