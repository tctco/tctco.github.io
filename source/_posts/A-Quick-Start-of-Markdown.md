---
title: A Quick Start of Markdown
date: 2019-03-15 01:00:00
tags: [markdown]
categories: Note
cover:
---

## Overview

This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements. It can’t cover every edge case, so if you need more information about any of these elements, refer to our reference guides for basic syntax and extended syntax.

## Basic Syntax

These are the elements outlined in John Gruber’s original design document. All Markdown applications support these elements.

## Element Markdown Syntax

#### Heading

The more # you get, the smaller the heading will be.
\#H1 ##H2 ###H3

# H1

## H2

### H3

------

### Fonts

**bold** ——**bold**

*Italic*——*italicized text*

### blockquote

\>blockquote——

> blockquote

### Ordered List

1.First item

2.Second item

3.Third item

1. First item
2. Second item
3. Third item

### Unordered List

\- First item

\- Second item

\- Third item

- First item
- Second item
- Third item

### Code

```
code`——`code
```

### Horizontal Rule

\---

------

### Link

[title]([https://www.example.com](https://www.example.com/))

[title](https://www.example.com/)

### Image

\!\[alt text\](image.jpg)

## Extended Syntax

These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

## Element Markdown Syntax

### Table

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

### Fenced Code Block

\```
{
“firstName”: “John”,
“lastName”: “Smith”,
“age”: 25
}
\```

```json
{  
  "firstName": "John",  
  "lastName": 
  "Smith",  
  "age": 25
}
```

### Strikethrough

\~~The world is flat.\~~

~~The world is flat.~~

### Task List

\- [x] Write the press release

\- [ ] Update the website

\- [ ] Contact the media

-  Write the press release
- Update the website
- Contact the media
