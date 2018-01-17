# webpack tree-shaking

### 这是一个测试 webpack tree-shaking 特性的 demo

首先，tree-shaking 依赖于 ES2015 的模块语法*import*和*export*，打包时检测未使用到的模块(unused harmony modules)，然后将其 shake 掉。

#### project

    webpack tree-shaking
    |- package.json
    |- webpack.config.js
    |- /dist
    |- index.bundle.js
    |- /src
    |- index.js
    |- util.js
    |- ddd.js
    |- /node_modules

#### src/util.js

    export class aaa {
      test() {
       return "aaa";
      }
    }

    export function bbb() {
      this.test = function() {
        return "bbb";
      };
    }

    export class ccc {
      test() {
        return "ccc";
      }
      extend(pre) {
        return pre + "ccc";
      }
    }

    export { ddd } from "./ddd";

#### src/ddd.js

    export default function ddd() {
      return "ddd";
    }
    ddd.prototype.test = function() {
      return "ddd";
    };
    Array.prototype.unique = function() {

    };

#### src/index.js

    import { aaa } from "./util";
    // import { bbb } from "./util";
    // import { ccc } from "./util";
    // import { ddd } from "./util";


    // import React from "react";
    // import { render } from "react-dom";
    // render(<div>111111111</div>, document.getElementById("app"));


    console.log(new aaa().test());
    // console.log(new bbb().test());
    // console.log(new ccc().test());
    // console.log(new ddd().test());

### 1.无引用

    "use strict";
    /* unused harmony export bbb */
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ddd__ = __webpack_require__(1);
    /* unused harmony reexport ddd */
    class aaa {
    test() {
    	return "aaa";
    }
    }
    /* harmony export (immutable) */ __webpack_exports__["a"] = aaa;


    function bbb() {
    this.test = function() {
    	return "bbb";
    };
    }

    class ccc {
    test() {
    	return "ccc";
    }
    extend(pre) {
    	return pre + "ccc";
    }
    }
    /* unused harmony export ccc */

可以看到未使用到的模块都已经标记出来

### 2.引入 BabiliPlugin 或者 UglifyJSPlugin 插件

    const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

    plugins: [new UglifyJSPlugin()]

最终生成代码

    !function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";n(1);e.a=class{test(){return"aaa"}}},function(t,e,n){"use strict";Array.prototype.unique=function(){}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0);console.log((new r.a).test())}]);

可以发现 bbb,ccc,ddd 已经成功被 shake 掉，但是输出的是 es6 代码，想要在 es5 环境运行的话，还需要引入 babel

### 3.引入 babel loader

    module: {
    	rules: [
    	{
    		test: /\.js$/,
    		loader: "babel-loader",
    		options: {
    		babelrc: false,
    		presets: [["es2015", { modules: false, loose: true }], "react"]
    		}
    	}
    	]
    }

最终生成代码

    !function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=2)}([function(t,n,e){"use strict";e.d(n,"a",function(){return o});e(1);function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(){r(this,t)}return t.prototype.test=function(){return"aaa"},t}();!function(){function t(){r(this,t)}t.prototype.test=function(){return"ccc"},t.prototype.extend=function(t){return t+"ccc"}}()},function(t,n,e){"use strict";Array.prototype.unique=function(){}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(0);console.log((new r.a).test())}]);

可以看到只有 bbb 和 ddd 被 shake 掉，ccc 依旧被打包进来。这是因为 babel 将 es6 class 转为 function，而 function 定义是有 side-effect 的，如下代码片段：(t 是混淆过的，其实是 ccc)

    !(function() {
      function t() {
        r(this, t);
      }
      (t.prototype.test = function() {
        return "ccc";
      }),
        (t.prototype.extend = function(t) {
          return t + "ccc";
        });
    })();

这是一个自执行函数，在 t 的 prototype 里定义了两个方法，然而如果这个 extend 方法是定义在 Object 或者是 Array 里的，那直接移除就是不安全的，所以前者也不能移除，也就是 function ccc 并没有 shake 掉

但是同样带有副作用的 ddd 方法为何被移除了？可以看到 ddd 使用的是 function 定义，并不会被 babel 转成自执行函数，然后 webpack 成功将 ddd 相关代码移除，仅留下了 Array 原型链上的 unique 方法定义(这个特性在最先的 webpack2 版本并未实现)

那么想用 es6 的 tree-shaking 该怎么做？

### 4.先生成 tree-shaking 后的 es6 代码，再用 babel 转换

    !function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=0)}([function(t,n){!function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=0)}([function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(1);console.log((new r.a).test())},function(t,n,e){"use strict";e(2),n.a=function(){function t(){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t)}return t.prototype.test=function(){return"aaa"},t}()},function(t,n,e){"use strict";Array.prototype.unique=function(){}}])}]);

可以看到仅剩下 aaa 了，其他都成功 shake 掉，大功告成

## 总结

### 想要在 webpack 中使用 tree-shaking，需要：

#### 1.使用 ES2015 模块语法（*import*和*export*）

#### 2.引入支持 tree-shaking 的压缩插件，如 BabiliPlugin 或 UglifyJSPlugin

#### 3.如果需要在非 es6 环境中运行，使用 function 定义组织模块，或者先将 es6 代码执行 tree-shaking，再转换为es5
