var t:number = 1
var list: Array<number> = [1, 2, 3]
var list1: number[] = [1, 2, 3]
console.log('list:', list)
console.log('list1', list1)

// 函数
function getAge():string {
  return 'liuyi'
}

// 传参方式
function getName( age:number, year:number):string {
  return 'nnn'
}

// 元组，数组元素中的类型是相同的，元组中的元素可以是不同的。

let arr = [10, 'ho']

// 联合类型
let str:string|number

str = 10
str = '10'

// 联合类型传参数, 联合类型数组

// 接口
interface Person {
  firstname:string,
  lastname:string,
  sayHi: () => string 
}
var xiao:Person = {
  firstname: 'name',
  lastname: 'james',
  sayHi: ():string => {return 'hi'}
}

// 类的定义
class Person {
  age:string;
  constructor(age:string) {
    this.age = age
  };
  eat():void {
    console.log('年龄：' + this.age)
  }
}

// 类的继承

class Cat extends Person {

}

// 类的重写（形参和返回值一致），重写（方法名相同，形参和返回值可以不同）


// 对象，obj
let obj = {
  
}




