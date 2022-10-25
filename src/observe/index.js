class Observer{
    constructor(data){
        //defineProperty method can only manipulate existed data
        this.walk(data);
    }
    walk(data){

        // Reassign attrs
        Object.keys(data).forEach(key=> defineReactive(data,key,data[key]));
    }
}

export function defineReactive(target, key, value){
    observe(value);
    Object.defineProperty(target, key,{
        get(){
            console.log("Qu zhi le");
            return value;
        },
        set(newVal){
            console.log("lai zhi le");
            if(newVal === value)return;
            value = newVal;
        }
    })
}
export function observe(data){

    if(typeof data !== 'object' || data == null){
        return;
    }



    return new Observer(data)

    // console.log(data);
}