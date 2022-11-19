// import nodeResolve from "@rollup/plugin-node-resolve";
import { parseHtml } from "./parse";


function getProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        //style:{"color":"red"}
        if (attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }


        str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }

    return `{${str.slice(0, -1)}}`
}


const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(child) {
    if (child.type === 1) {
        return codeGenerator(child);
    } else {
        let text = child.text;
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`;
        } else {
            let token = [];
            let match;
            defaultTagRE.lastIndex = 0;
            let lastIdx = 0;
            while(match = defaultTagRE.exec(text)){
                let index = match.index;
                // handle the situation {{name}} hello {{name}}
                if(index > lastIdx){
                    token.push(JSON.stringify(text.slice(lastIdx, index)));
                }


                token.push(`_s(${match[1].trim()})`)
                lastIdx = index + match[0].length
            }
            if(lastIdx < text.length){
                token.push(text.slice(lastIdx));
            }

            return `_v(${token.join('+')})`
        }
    }
}

function getChildren(children) {
    return children.map(child => gen(child)).join(',')
}

function codeGenerator(astTree) {
    let children = getChildren(astTree.children);
    let code = (`_c('${astTree.tag}', ${astTree.attrs.length > 0 ? getProps(astTree.attrs) : 'null'}
    ${astTree.children.length ? `,${children}` : ''})`);

    return code;
}

export function compileToFunction(template) {
    // parse template into an AST Tree
    let astTree = parseHtml(template);
    console.log("astTree", astTree);

    // Render method
    // console.log(codeGenerator(astTree));

    // Essence of template engine is 'with()' plus new Function
    let code = codeGenerator(astTree);
    code = `with(this){return ${code}}`;
    let render = new Function(code);
    // console.log(render.toString())
    return render;
}