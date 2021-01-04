---
name: Markdown page
---

# Markdown 编码规范

## 简介

此为前端开发团队遵循和约定的`Markdown 编写规范`,意在提高文档的可读性。

```javascript
console.log('');
```

## 说明

本规范中用到的关键字**必须** `MUST` ，**不能** `MUST NOT`，**要求** `REQUIRED`，将会 `SHALL`，**不会** `SHALL NOT`，**应该** `SHOULD`，**不应该** `SHOULD NOT`，**推荐** `RECOMMENDED`，**可以** `MAY`，**可选** `OPTIONAL` 都是按照 `IETF RFC 2119` [RFC2119] 中的描述解释。

## 规则

1. 【必须】 文件后缀使用 `.md`,不可以使用`.mdx`等后缀
2. 【必须】文件名使用小写，多个单词之间使用`-`分隔
3. 【必须】文件编码使用用 UTF-8
4. 【应当】文档标题应该使用这种格式

```markdown
# Markdown 编写规范

============
```

5. 【必须】章节标题必须以 `##` 开始，而不是 `#`

6. 【必须】章节标题必须在 `#` 后加一个空格，且后面没有 `#`

```markdown
<!-- bad  -->

##章节 1

<!-- bad  -->

## 章节 1

<!-- good  -->

## 章节 1
```

7. 【必须】章节标题和内容间必须有一个空行

```markdown
<!-- bad  -->

## 章节 1

内容

## 章节 2

<!-- good  -->

## 章节 1

内容

## 章节 2
```

8. 【必须】代码段的必须使用 Fenced code blocks 风格，并且在受防护的代码块之前的反引号旁边指定一种语言，如下所示：

````markdown
```javascript
console.log('');
```
````

1. 【应当】表格的写法应该参考 [GFM](https://help.github.com/articles/github-flavored-markdown)，如下所示：

```markdown
| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ | :-------------: | ------------: |
| col 3 is      | some wordy text |         $1600 |
| col 2 is      |    centered     |           $12 |
| zebra stripes |    are neat     |            $1 |
```

10. 【应当】中英文混排应该采用如下规则：

- 英文和数字使用半角字符
- 中文文字之间不加空格
- 中文文字与英文、阿拉伯数字及 @ # $ % ^ & \* . ( ) 等符号之间加空格
- 中文标点之间不加空格
- 中文标点与前后字符（无论全角或半角）之间不加空格
- 如果括号内有中文，则使用中文括号
- 如果括号中的内容全部都是英文，则使用半角英文括号
- 当半角符号 / 表示「或者」之意时，与前后的字符之间均不加空格
- 其它具体例子推荐[阅读这里](https://github.com/sparanoid/chinese-copywriting-guidelines)

11. 【应当】中文符号应该使用如下写法：

- 用直角引号（「」）代替双引号（“”）

- 省略号使用「……」，而「。。。」仅用于表示停顿

12. 表达方式，应当「SHOULD」遵循《The Element of Style》：

- 使段落成为文章的单元：一个段落只表达一个主题
- 通常在每一段落开始要点题，在段落结尾要扣题
- 使用主动语态
- 陈述句中使用肯定说法
- 删除不必要的词
- 避免连续使用松散的句子
- 使用相同的结构表达并列的意思
- 将相关的词放在一起
- 在总结中，要用同一种时态（这里指英文中的时态，中文不适用，所以可以不理会）
- 将强调的词放在句末

## 扩展阅读

- [Markdown 语法教程](https://markdown.com.cn/)
