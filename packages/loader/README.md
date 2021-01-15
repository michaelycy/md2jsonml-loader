# `loader`

> TODO: description

## Usage

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
