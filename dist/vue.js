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

  function compileToFunction(template) {
    console.log(template);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      // console.log("3");
      // state initalizing...
      initState(vm);
      // console.log("2");
      // mount element
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
        if (template) {
          var render = compileToFunction(template);
          options.render = render;
        }
      }
      options.render;
    };
  }

  function Vue(options) {
    // debugger
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
