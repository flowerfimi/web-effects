# Web Effects

点击爱心、飘落樱花和丝线鼠标拖尾特效。

## 使用方法

在网页的 `</body>` 前添加以下代码，可按需选择其中任意效果：

```html
<!-- 点击爱心 -->
<script src="https://cdn.jsdelivr.net/gh/flowerfimi/web-effects@v1.0.0/js/click-hearts.js"></script>
<!-- 飘落樱花 -->
<script src="https://cdn.jsdelivr.net/gh/flowerfimi/web-effects@v1.0.0/js/cherry-blossoms.js"></script>
<!-- 丝线鼠标拖尾 -->
<script src="https://cdn.jsdelivr.net/gh/flowerfimi/web-effects@v1.0.0/js/silk-cursor.js"></script>
```

## 自定义丝线

默认循环变色，也可以指定固定颜色和叠放层级：

```html
<script
  src="https://cdn.jsdelivr.net/gh/flowerfimi/web-effects@v1.0.0/js/silk-cursor.js"
  data-color="rgba(100,190,255,0.35)"
  data-z-index="9999"></script>
```

- `data-color`：线条颜色，省略时自动变色。
- `data-z-index`：画布叠放层级，默认 `9999`。

停止并移除丝线效果：

```js
window.SilkCursor?.destroy();
```
