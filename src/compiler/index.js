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
    while(html){
        html.indexOf('<') // if idx == 0, it starts at tag
        
    }
}


export function compileToFunction(template){
    // parse template into an AST Tree

    // console.log(template)
}