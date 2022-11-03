// Regular Expressions needed
// https://regexper.com/ 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^${qnameCapture}`);
const endTag = new RegExp(`<\\/${qnameCapture}[^>]*>`);
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
        console.log(tag,attrs,'begin');
    }
    function end(tag){
        let node =stack.pop();
        curParent = stack[stack.length -1];
        console.log(node,'end');
    }    function chars(text){
        text = text.replace(/\s/g,"")
        curParent.children.push({
            type: TEXT_TYPE,
            text
        })
        console.log(text,'text');
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

            // match all attributes until closeTag
            let attrs, end;
            while(!(end = html.match(startTagClose)) && (attrs = html.match(attribute))){
                advance(attrs[0].length);
                match.attrs.push({name:attrs[1],value:attrs[3] || attrs[4] || attrs[5] || true});
            }

            if(end){
                advance(match[0].length);
            }
            return match;
        }


        return false;   
    }

    while(html){
        let textEnd = html.indexOf('<') // if idx == 0, it starts at tag, else it is the end of text

        if(textEnd == 0){
            const startTagMatches = parseStartTag();

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
    console.log(root); //
    return root;
}