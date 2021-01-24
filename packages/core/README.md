# `md2jsonml-core`

> Using mark-twain to convert markdown to jsonMl

## Getting Started

```
npm i md2jsonml-core
```

## Usage

```javascript
const MT = require('md2jsonml-core');
const fs = require('fs');
const jsonML = MT(fs.readFileSync('readme.md','utf-8');
```

其返回值为 `jsonMl`：

```json
{
  // YAML will be parsed as meta data.
  meta: {
    title: 'Title',
    ...
  },

  // Others will be parsed as JsonML.
  content:  [
    "article",
    ["h1", "Here is a heading"],
    [
      "ol",
      [
        "li",
        [
          "p",
          "First"
        ]
      ],
      ...
    ],
    [
      "p",
      "This is a paragraph, including ",
      [
        "em",
        "EM"
      ],
      " and ",
      [
        "strong",
        "STRONG"
      ],
      ". Any question? Oh, I almost forget ",
      [
        "code",
        "inline code"
      ],
      "."
    ],
    ...
  ]
}
```

## License

[MIT](https://github.com/michaelycy/md2jsonml-loader/blob/master/LICENSE)
