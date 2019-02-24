var a = {
  name: 'aaa',
  fn: function () {
    console.log(this.name)
  },
  fnCall: function () {
    return function () {
      console.log(this)
    }
  }
};
a.fn()
a.fn.call({name: 'bbbb'})
var fn1 = a.fn()

function Foo(name) {
  this.name = name
  console.log(this)
}

var foo = new Foo('kkxiaojun')

var a = '111';
function find() {
  console.log(a)
}

function F1() {
  var a = 100;
  return function () {
    console.log(this)
    console.log(a)
  }
}

var f1 = F1()
var a = 200;
