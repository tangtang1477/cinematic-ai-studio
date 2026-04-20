

## 问题

`card-back-sm.webp` 图片本身周围带有白边/留白边距，即便 `objectFit: "cover"` 也无法消除（因为 cover 是基于图片的实际像素边界来填充，白边在像素内）。

## 方案

只改一个文件：`src/components/CardBack.tsx`

通过 CSS `transform: scale(1.08)` + `overflow: hidden`（已由父级 `card-back` wrapper 提供）将图片轻微放大，让白边溢出到卡片圆角外被裁掉，扑克图案正好填满卡片容器。

具体改动：
- `<img>` 增加 `transform: scale(1.08)` 和 `transformOrigin: "center"`
- 保留现有的 `objectFit: "cover"` 和 100% 宽高
- scale 值 1.08 是基于常见 webp 边距 ~4% 估算（如视觉上仍有白边可微调到 1.10-1.12）

## 不动

- FlyingCardsScene.tsx 不改一行
- card-back-sm.webp 图片源不替换
- 所有动效、视频、卡片正面、布局保持不变

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/CardBack.tsx` | `<img>` style 增加 `transform: scale(1.08)` |

## 验收

无痕刷新页面，飞入阶段的卡片背面扑克图案完全填满卡片矩形区域，四周无白边，圆角干净。

