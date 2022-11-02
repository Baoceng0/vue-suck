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

function parseHtml(html){
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
        }

        // match all attributes until closeTag
        let attrs, end;
        while(!(end = html.match(startTagClose)) && (attrs = html.match(attribute))){
            advance(attrs[0].length);
            match.attrs.push({name:attrs[1],value:attrs[3] || attrs[4] || attrs[5]});
        }

        return false;   
    }
    while(html){
        let textEnd = html.indexOf('<') // if idx == 0, it starts at tag, else it is the end of text

        if(textEnd == 0){
            const tagmatches = parseStartTag();
            break;
        }

        
    }
}


export function compileToFunction(template){
    // parse template into an AST Tree

    // console.log(template)
}