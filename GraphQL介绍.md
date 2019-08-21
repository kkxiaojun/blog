# GraphQL介绍

`GraphQL` 是 Facebook 开发的一种 **API 的查询语言**（最开始应用于移动端），于 2015 年公开发布，是 REST API 的替代品。

`GraphQL` 既是一种用于 API 的**查询语言**也是一个满足你数据查询的**运行时**。 `GraphQL` 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且**没有任何冗余**，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

官方网站：[https://graphql.org/](<https://graphql.org/>)

中文网站：[https://graphql.cn/](<https://graphql.cn/learn/>)

### 特点

引用官网的话：

> ## Ask for what you need, get exactly that

1. 请求你需要的资源，不多不少。

   如：移动端和web端对应相同后端，则获取：name，value等，各端只需取自己所需的字段

2. 获取多个资源，只用一个请求。

    `REST API` 请求多个资源时得载入多个 URL，而 `GraphQL` 可以通过一次请求就获取你应用所需的所有数据。特别是移动端，大的减少http请求。

3. 描述所有可能类型的系统。便于维护，根据需求平滑演进，添加或隐藏字段。（js，是弱类型。VUE是用flow进行静态类型检测的）

### 示例

先看看简单的示例：

```
query {
    name
}
```

得到的结果

```
{
    "data": {
        "name": "六一"
    }
}
```



# GraphQL与restful对比

1. restful

   全称：`Representational State Transfer` 表属性状态转移。
    本质上就是定义 uri ，通过 API 接口来取得资源。通用系统架构，不受语言限制。

   例子：学员列表接口
    如：接口 `/liuyi/v2/student?userId=13` 就是个典型的 `restful` 接口，定义资源 + 查询条件。

2. 与GraphQl对比

   * `restful` 一个接口只能返回一个资源，`GraphQL`一次可以获取多个资源。
   * `restful` 用不同 url 来区分资源，`GraphQL` 用类型区分资源。

# 几个重要概念

这里先介绍几个对理解 GraphQL 比较重要的概念，其他类似于指令、联合类型、内联片段等更复杂的用法，参考 官网文档 

### 操作类型 Operation Type

GraphQL 的操作类型可以是 `query`、`mutation` 或 `subscription`，描述客户端希望进行什么样的操作

1. query 查询：获取数据，比如查找，CRUD 中的 R。
2. mutation 变更：对数据进行变更，比如增加、删除、修改，CRUD 中的 CUD。
3. substription 订阅：当数据发生更改，进行消息推送。

这些操作类型都将在后文实际用到，比如这里进行一个查询操作。其中一个类型：

```
type Query {
  me: User
}
```

一并的还有每个类型上字段的解析函数：

```
function Query_me(request) {
  return request.auth.user;
}
```



### 对象类型（外层的定义）和标量类型(具体数据) Object Type & Scalar Type

如果一个 GraphQL 服务接受到了一个 `query`，那么这个 `query` 将从 `Root Query` 开始查找，找到对象类型（Object Type）时则使用它的解析函数 Resolver 来获取内容，如果返回的是对象类型则继续使用解析函数获取内容，如果返回的是标量类型（Scalar Type）则结束获取，直到找到最后一个标量类型。

1. 对象类型：用户在 schema 中定义的 `type`
2. 标量类型：GraphQL 中内置有一些标量类型 `String`、`Int`、`Float`、`Boolean`、`ID`，用户也可以定义自己的标量类型

比如在 Schema 中声明

```
type User {
  name: String!
  age: Int
}
```



这个 `User` 对象类型有两个字段，name 字段是一个为 `String` 的非空标量，age 字段为一个 `Int` 的可空标量。

### 模式 Schema

用过 MongoOSE，那你应该对 Schema 这个概念很熟悉

它定义了字段的类型、数据的结构，描述了接口数据

请求的规则，当我们进行一些错误的查询的时候 GraphQL 引擎会负责告诉我们哪里有问题，和详细的错误信息，对开发调试十分友好。



# 搭建基本案例

### 简单例子

