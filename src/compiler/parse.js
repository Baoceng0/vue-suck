// Regular Expressions needed
// https://regexper.com/ 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// console.log(attribute);
const startTagClose = /^\s*(\/?)>/;
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseHtml(html){
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = [];
    let curParent;
    let root;
    
    function createASTelement(tag,attrs){
        return {
            tag,
            type:ELEMENT_TYPE,
            children:[],
            attrs,
            parent:null
        };
    }

    function start(tag,attrs){
        let node = createASTelement(tag,attrs);
        if(!root){
            root = node;
        }
        if(curParent){
            node.parent = curParent;
            curParent.children.push(node);
        }
        stack.push(node);
        curParent = node;
        // console.log(tag,attrs,'begin');
    }
    function end(tag){
        let node =stack.pop();
        curParent = stack[stack.length -1];
        // console.log(node,'end');
    }
    function chars(text){
        text = text.replace(/\s/g,"")
        text && curParent.children.push({
            type: TEXT_TYPE,
            text,
            parent:curParent
        })
        // console.log(text,'text');
    }
    function advance(len){
        html = html.substring(len);
    }
    function parseStartTag(){
        const start = html.match(startTagOpen);
        if(start){
            const match = {
                tagName: start[1], // tag name
                attrs:[]
            }
            advance(start[0].length);
            // console.log(match, html)
            // match all attributes until closeTag
            let attrs, end;
            while(!(end = html.match(startTagClose)) && (attrs = html.match(attribute))){
                advance(attrs[0].length);
                match.attrs.push({name:attrs[1],value:attrs[3] || attrs[4] || attrs[5] || true});
            }

            if(end){
                advance(end[0].length);
            }
            // console.log(match)
            return match;
        }


        return false;   
    }

    while(html){
        let textEnd = html.indexOf('<') // if idx == 0, it starts at tag, else it is the end of text

        if(textEnd == 0){
            const startTagMatches = parseStartTag();
            console.log(startTagMatches);
            if(startTagMatches){
                start(startTagMatches.tagName,startTagMatches.attrs);
                continue;
            }

            let endTagMatches = html.match(endTag);
            if(endTagMatches){
                advance(endTagMatches[0].length);
                end(endTagMatches[1]);
                continue;
            }
        }
        // break;
        if(textEnd >= 0){
            let text = html.substring(0,textEnd);
            if(text){
                chars(text);
                advance(text.length);
            }
            // break;
        }
    }
    console.log(html);// Parsing going well if html is null
    // console.log(root);
    return root;
}