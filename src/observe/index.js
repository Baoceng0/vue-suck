import { newArrayProto } from "./array";

class Observer{
    constructor(data){
        Object.defineProperty(data,'__ob__',{
            value: this,
            enumerable:false,
        })
        //defineProperty method can only manipulate existed data
        // data.__ob__ = this;
        if(Array.isArray(data)){
            //override methods of Array， but generally maintain the old one
            // data.__proto__ = {
            //     push(){
            //         console.log('Override');
            //     }
            // }
            data.__proto__ = newArrayProto
            this.observerArray(data)
        } else {
            this.walk(data);
        }
    }
    walk(data){

        // Reassign attrs
        Object.keys(data).forEach(key=> defineReactive(data,key,data[key]));
    }
    observerArray(data){
        data.forEach(item=> observe(item));
    }
}

export function defineReactive(target, key, value){
    // if(typeof value === 'object')console.log("3", value);
    observe(value);
    Object.defineProperty(target, key,{
        get(){
            console.log("Qu zhi le4");
            return value;
        },
        set(newVal){
            console.log("lai zhi le4");
            if(newVal === value)return;
            observe(newVal)
            value = newVal;
        }
    })
}
export function observe(data){

    if(typeof data !== 'object' || data == null){
        return;
    }

    if(data.__ob__ instanceof Observer){
        // data has been proxyed before
        return data.__ob__;
    }

    return new Observer(data)

    // console.log(data);
}