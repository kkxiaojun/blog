# 不了解hash,chunkhash和contenthash
> 确保浏览器选择更改的文件的简单方法是使用 output.filename替换。该[hash]置换可用于文件名中包含一个内置特定的哈希值，但它甚至更好使用[contenthash]替代这是一个文件的内容，这是每个资产不同的哈希值。

<font color=red>官方文档中有关其用途的简要说明, output-filename的描述:</font>
[https://www.webpackjs.com/configuration/output/#output-filename](https://www.webpackjs.com/configuration/output/#output-filename)


|模板|描述|
|---|---|
|[hash]|是“为每个构建生成的唯一hash” |
|[chunkhash]| 是“基于每个块的内容”的hash” |
|[contenthash] | 是“为提取的内容生成的”。 在使用 ExtractTextWebpackPlugin(MiniCssExtractPlugin) 时，可以用 [contenthash] 来获取提取文件的 hash（既不是 [hash] 也不是 [chunkhash]）

在这想通过示例的方式进一步理解：
我在我的3个文件src目录：`index.js`，`index.css`，`vendors.js`

关于`webpack.config.js`的配置：

```javascript
entry: {
  index: ["./src/index.js", "./src/index.css"],
  vendors: ["./src/vendors.js"]
},
output: {
  filename: "[name].[hash].js"
}
plugins: [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  })
]
```

因此，我有2个块名称，index和vendors，但是看起来该index块也将具有css内容，因为它css在数组中导入了一个文件。构建时，css将使用MiniCssExtractPlugin（在我的情况下）将零件导出到单独的文件，但Webpack知道这一点，index.js并且index.css属于同一块。

现在，让我们尝试使用不同的哈希类型来构建它。（filename相等地更改两个选项,[hash][chunkhash]）

**示例1：使用`hash`**

`webpack.config.js`配置：
```javascript
entry: {
  index: ["./src/index.js", "./src/index.css"],
  vendors: ["./src/vendors.js"]
},
output: {
  filename: "[name].[hash].js"
}
plugins: [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  })
]
```

上图[]()

每个文件都具有相同的哈希值，因为它[hash]是基于我们使用的所有源文件生成的。如果我重新运行该构建而不更改任何内容，则生成的哈希将保持不变。如果我仅编辑一个文件，则哈希值将发生变化，并且所有生成的捆绑软件的名称中都会包含此新哈希值。

**示例2：使用`chunkhash`**
`webpack.config.js`配置：
```javascript
entry: {
  index: ["./src/index.js", "./src/index.css"],
  vendors: ["./src/vendors.js"]
},
output: {
  filename: "[name].[hash].js"
}
plugins: [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  })
]
```

如您所见，第一个和第二个文件来自同index一块，因此它们的名称具有相同的哈希值。这是因为[chunkhash]是基于给定块的全部内容生成的。因此，如果我说编辑index.css并重新构建，来自index块的文件将具有一个新的哈希，但来自vendors块的文件将保持与以前相同。

**示例3：使用`contenthash`**
`webpack.config.js`配置：
```javascript
entry: {
  index: ["./src/index.js", "./src/index.css"],
  vendors: ["./src/vendors.js"]
},
output: {
  filename: "[name].[contenthash].js"
}
plugins: [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  })
]
```

这是显而易见的。每个生成的文件的名称都有一个唯一的哈希值，该哈希值是根据该文件的内容计算得出的。如果我进行更改，例如index.css重新构建，则仅生成的index.css将具有新的哈希。
