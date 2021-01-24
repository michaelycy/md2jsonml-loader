# `markdown to jsonML loader`

![npm](https://img.shields.io/npm/v/webpack-md2jsonml-loader?color=rgb%280%2C%20126%2C%20198%29&style=flat-square)

> Using mark-twain to convert markdown to jsonMl, work on webpack.

## Features

- convert markdown to jsonMl
- Support code highlight
- Support parse demo code

## Getting Started

To begin, you'll need to install `webpack-md2jsonml-loader`:

### webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/i,
        use: 'webpack-md2jsonml-loader',
        options: {
          clsPrefix: 'ku',
        },
      },
    ],
  },
};
```

## Options

|            Name             |       Type        |                          Default                          | Description                             |
| :-------------------------: | :---------------: | :-------------------------------------------------------: | :-------------------------------------- |
|       **`clsPrefix`**       |    `{String}`     |                           `md`                            | 样式名称前缀                            |
|      **`tocMaxDepth`**      |    `{Number}`     |                            `2`                            | 提取 toc 最大深度                       |
|      **`tocKeepElem`**      |    `{Boolean}`    |                          `false`                          | 是否在标题中保存元素                    |
|    **`demoBabelConfig`**    |    `{Object}`     |                 `babel-preset-react-app`                  | demo 代码解析 babel 配置                |
| **`demoResolveExtensions`** | `{Array<string>}` | `['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.css']` | demo 代码解析时尝试按顺序解析这些后缀名 |

## 标记规范

1. 代码模块

```markdown
#### 按钮类型

---

按钮有七种类型：主按钮、副按钮、次按钮、虚框按钮、主文按钮、次文按钮、危险按钮。
<demo cols="4" src="./path.js">
```

上面的 markdown 内容会转换为一下的数据

```javascript
{
  title: ['h4', ' 按钮类型'];
  content: [
    'p',
    '按钮有七种类型：主按钮、副按钮、次按钮、虚框按钮、主文按钮、次文按钮、危险按钮。',
  ];
  attributes:{
    cols:4,
    src:'/User/*/path.js'
  }
}
```

`demo` 标签中的属性只有`src`属性为必填属性，并且`src`在转换时会自动转换为**绝对路径**,此外还可以为 `demo` 添加自定义属性比如：theme="dark" 等

## License

[MIT](https://github.com/michaelycy/md2jsonml-loader/blob/master/LICENSE)
