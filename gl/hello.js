const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')

// 构建schema，这里定义查询的语句和类型
const schema = buildSchema(`
    type Query {
        hero: String
    }
`)

// 定义查询所对应的 resolver，也就是查询对应的处理器
const root = {
    hero: () => {
        return "I'm iron man"
    }
}

const app = express()

// 将路由转发给 graphqlHTTP 处理
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3000)