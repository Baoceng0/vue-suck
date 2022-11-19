(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      // console.log('me',method);
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
      }
      console.log(inserted);
      if (inserted) {
        ob.observerArray(inserted);
      }
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      //defineProperty method can only manipulate existed data
      // data.__ob__ = this;
      if (Array.isArray(data)) {
        //override methods of Array， but generally maintain the old one
        // data.__proto__ = {
        //     push(){
        //         console.log('Override');
        //     }
        // }
        data.__proto__ = newArrayProto;
        this.observerArray(data);
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // Reassign attrs
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    // if(typeof value === 'object')console.log("3", value);
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        console.log("Qu zhi le4");
        return value;
      },
      set: function set(newVal) {
        console.log("lai zhi le4");
        if (newVal === value) return;
        observe(newVal);
        value = newVal;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }
    if (data.__ob__ instanceof Observer) {
      // data has been proxyed before
      return data.__ob__;
    }
    return new Observer(data);

    // console.log(data);
  }

  function initState(vm) {
    var ops = vm.$options;
    if (ops.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newVal) {
        console.log("lai zhi le2");
        vm[target][key] = newVal;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data;
    // debugger
    data = typeof data === 'function' ? data.call(vm) : data;

    // console.log(data);
    vm._data = data;
    // Vue2 data observer
    observe(data);

    // encapsulate vm._data ---> vm
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // Regular Expressions needed
  // https://regexper.com/ 
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // console.log(attribute);
  var startTagClose = /^\s*(\/?)>/;
  function parseHtml(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var curParent;
    var root;
    function createASTelement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tag, attrs) {
      var node = createASTelement(tag, attrs);
      if (!root) {
        root = node;
      }
      if (curParent) {
        node.parent = curParent;
        curParent.children.push(node);
      }
      stack.push(node);
      curParent = node;
      // console.log(tag,attrs,'begin');
    }

    function end(tag) {
      stack.pop();
      curParent = stack[stack.length - 1];
      // console.log(node,'end');
    }

    function chars(text) {
      text = text.replace(/\s/g, '');
      curParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: curParent
      });
      // console.log(text,'text');
    }

    function advance(len) {
      html = html.substring(len);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          // tag name
          attrs: []
        };
        advance(start[0].length);
        // console.log(match, html)
        // match all attributes until closeTag
        var attrs, _end;
        while (!(_end = html.match(startTagClose)) && (attrs = html.match(attribute))) {
          advance(attrs[0].length);
          match.attrs.push({
            name: attrs[1],
            value: attrs[3] || attrs[4] || attrs[5] || true
          });
        }
        if (_end) {
          advance(_end[0].length);
        }
        // console.log(match)
        return match;
      }
      return false;
    }
    while (html) {
      var textEnd = html.indexOf('<'); // if idx == 0, it starts at tag, else it is the end of text

      if (textEnd == 0) {
        var startTagMatches = parseStartTag();
        if (startTagMatches) {
          start(startTagMatches.tagName, startTagMatches.attrs);
          continue;
        }
        var endTagMatches = html.match(endTag);
        if (endTagMatches) {
          advance(endTagMatches[0].length);
          end(endTagMatches[1]);
          continue;
        }
      }
      // break;
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          chars(text);
          advance(text.length);
        }
        // break;
      }
    }
    // console.log(html);// Parsing going well if html is null
    // console.log(root);
    return root;
  }

  function getProps(attrs) {
    var str = '';
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      //style:{"color":"red"}
      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];
            obj[key] = value;
          });
          attr.value = obj;
        })();
      }
      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function gen(child) {
    if (child.type === 1) {
      return codeGenerator(child);
    } else {
      var text = child.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var token = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIdx = 0;
        while (match = defaultTagRE.exec(text)) {
          var index = match.index;
          // handle the situation {{name}} hello {{name}}
          if (index > lastIdx) {
            token.push(JSON.stringify(text.slice(lastIdx, index)));
          }
          token.push("_s(".concat(match[1].trim(), ")"));
          lastIdx = index + match[0].length;
        }
        if (lastIdx < text.length) {
          token.push(text.slice(lastIdx));
        }
        return "_v(".concat(token.join('+'), ")");
      }
    }
  }
  function getChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  function codeGenerator(astTree) {
    var children = getChildren(astTree.children);
    var code = "_c('".concat(astTree.tag, "', ").concat(astTree.attrs.length > 0 ? getProps(astTree.attrs) : 'null', "\n    ").concat(astTree.children.length ? ",".concat(children) : '', ")");
    return code;
  }
  function compileToFunction(template) {
    // parse template into an AST Tree
    var astTree = parseHtml(template);
    console.log("astTree", astTree);

    // Render method
    // console.log(codeGenerator(astTree));

    // Essence of template engine is 'with()' plus new Function
    var code = codeGenerator(astTree);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    // console.log(render.toString())
    return render;
  }

  function createElement(vm, tag, data) {
    if (data == null) {
      data = {};
    }
    var key = data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function createElm(vnode) {
    var _vnode = _slicedToArray(vnode, 4),
      tag = _vnode[0],
      data = _vnode[1],
      children = _vnode[2],
      text = _vnode[3];
    console.log("data", data);
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); // mount real element onto vnode

      patchProps(vnode.el, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function patch(oldVnode, newVnode) {
    console.log("oldVnode", oldVnode);
    // first time 
    var isRealEl = oldVnode.type;
    console.log("isRealEl", isRealEl);
    if (isRealEl) {
      console.log("new", newVnode);
      var elm = oldVnode;
      var parentElm = elm.parentNode;
      var newElm = createElm(newVnode);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm);
      return newElm;
    }
  }
  function initLicycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      console.log("update", vnode);
      // console.log(el);

      // initialize and update DOM
      // vnode -> dom
      vm.$el = patch(vnode, el);
      console.log('el', el);
    };
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;

    //1 create Vnode by render()
    vm._update(vm._render());

    //2 VDOM -> DOM
    //3 insert DOM into el
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
      if (options.el) {
        console.log("1");
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var options = vm.$options;
      //priority: render > template > el
      if (!options.render) {
        var template;
        if (!options.template && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = options.template;
          }
        }
        // console.log(template);
        if (template && el) {
          var render = compileToFunction(template);
          options.render = render;
        }
      }
      // console.log(options.render);
      mountComponent(vm, el);
    };
  }

  function Vue(options) {
    // debugger
    this._init(options);
  }
  initMixin(Vue);
  initLicycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
