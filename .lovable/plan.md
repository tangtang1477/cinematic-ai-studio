

## 问题分析

1. **卡片背面空白**：`CardBack.tsx` 引用 `card-back.jpg` 存在且为 274KB，文件本身应该没问题。根因是 `FlippableCard` 的 3D 结构在某些浏览器中 `backface-visibility: hidden` 配合 `preserve-3d` 不稳定 — 需要在 back face 上也加 `transform-style: flat` 强制隔离，并给 CardBack 加上 `box-sizing: border-box` 和明确宽高。另外需要重新复制用户上传的图片覆盖现有的 `card-back.jpg`（确保是最新版本）。

2. **蒙层上边缘没有渐变模糊**：Layer 2 的 `backdrop-filter + mask-image` 在落地卡片中也可能失效，因为落地卡片外层有 `translate3d` transform。需要确保落地卡片的容器不使用 3D transform，或者把蒙层完全改用 `background` 半透明渐变代替 `backdrop-filter`（因为在复杂 transform 上下文中 `backdrop-filter` 始终不可靠）。

3. **视频1播放卡顿**：2K 视频文件较大，需要给 intro 视频加 `preload="auto"` 确保浏览器提前缓冲，同时检查视频编码是否为 web 友好格式。

## 改动方案

### 1. 卡片背面修复 — `src/assets/card-back.jpg` + `src/components/FlippableCard.tsx` + `src/components/CardBack.tsx`
- 重新复制用户上传的扑克牌图片到 `src/assets/card-back.jpg`
- `FlippableCard.tsx`：给前后面的容器都加 `transformStyle: "flat"` 避免 3D 嵌套导致 backface 判定异常
- `CardBack.tsx`：给外层 div 加 `boxSizing: "border-box"` 并确保 `position: relative`

### 2. 蒙层模糊彻底改用非 backdrop-filter 方案 — `src/components/TemplateCard.tsx`
- **放弃 `backdrop-filter`**，改用叠加半透明渐变 + 微量模糊的伪元素方案
- 具体：Layer 2 改为用 `background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))` 配合 `filter: blur(0.5px)` 模拟上边缘渐变，不再依赖 `backdrop-filter`
- 或者更好的方案：在图片上叠一层 `<div>` 用 CSS `filter: blur(8px)` 对图片的克隆做模糊，然后用 mask 裁剪只显示底部区域 — 但这比较复杂
- 最简单可靠的方案：把 3 层合并为一个渐变黑色蒙层 `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%)`，上边缘自然渐变透明，视觉效果接近模糊

### 3. 视频1播放优化 — `src/pages/Index.tsx`
- intro 视频加 `preload="auto"` 让浏览器提前下载完整视频
- loop 视频也加 `preload="auto"`

### 涉及文件

| 文件 | 改动 |
|---|---|
| `src/assets/card-back.jpg` | 重新用用户上传的图片覆盖 |
| `src/components/FlippableCard.tsx` | 前后面加 `transformStyle: "flat"` |
| `src/components/CardBack.tsx` | 加 `boxSizing`、确保尺寸稳定 |
| `src/components/TemplateCard.tsx` | 放弃 `backdrop-filter`，改用纯渐变蒙层实现上边缘过渡 |
| `src/pages/Index.tsx` | 视频加 `preload="auto"` |

