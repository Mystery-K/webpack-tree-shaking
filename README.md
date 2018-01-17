# webpack tree-shaking

### 这是一个测试 webpack2 tree-shaking 特性的 demo

首先，tree-shaking 依赖于 ES2015 的模块特性*import*和*export*，打包时检测未使用到的模块(unused harmony modules)，然后将其 shake 掉。

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

### 1.未使用 tree-shaking

<code>
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
</code>
可以看到未使用到的模块都已经标记出来

### 2.使用 tree-shaking，在 webpack.config.js 中引入 BabiliPlugin 或者 UglifyJSPlugin

<code></code>
