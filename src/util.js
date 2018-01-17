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
