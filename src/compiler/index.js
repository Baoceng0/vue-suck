export function compileToFunction(template){
    // parse template into an AST Tree
    let astTree = parseHtml(template);
    console.log(astTree);

    // Render method
    codeGenerator(astTree);
    // render(){
    //     return {
    //         h('div',{id:'app'},h('div',{style:{color:'red'}}), _v(_s(name) + "hello"));
    //     }
    // }
}