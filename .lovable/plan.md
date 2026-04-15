

## 问题总结

5 个需要修复的问题：

1. **替换视频**：用户上传了两个新视频文件（首次2K.mp4 和 循环.mp4），需要替换 public/videos/ 下的 intro.mp4 和 loop.mp4
2. **卡片翻转动效不丝滑 + 背面空白**：当前 cardFlip 动画虽然写了 rotateY，但 `backface-visibility` 在 3D transform 嵌套中可能被破坏。背面的 CardBack 组件虽然引用了 card-back.jpg，但需要确认图片存在且用的是用户新上传的图。同时翻转过程需要"边放大边翻转"，当前 scale 只在外层 cardFlight 中，翻转在内层 cardFlip 中，两者是独立的 — 需要合并让放大和翻转同步
3. **图片预加载卡顿**：`preloadTemplateImages` 用了 `new Image() + decode()`，但 TemplateCard 里的 `<img>` 用的是 `decoding="async"`，浏览器可能重新解码。需要改为 `decoding="sync"` 或在预加载完成后再渲染卡片
4. **视频在卡片动画期间停止播放**：loop 视频没有 `loop` 属性，依赖 `onEnded` 手动 `play()`。但 `handleLoopEnded` 在触发 `cards-fly` 后仍然调用了 `play()`，可能是 `onEnded` 不可靠。直接加 `loop` 属性，用 `onEnded` 只做一次性触发
5. **蒙层上边缘渐变模糊丢失**：Layer 2 的 `backdrop-filter: blur(8px)` 配合 `mask-image` 在 3D transform 容器内可能被浏览器忽略。需要确保蒙层不在 `preserve-3d` 的子树中

## 改动方案

### 1. 替换视频文件
- 复制 `user-uploads://首次2K.mp4` → `public/videos/intro.mp4`
- 复制 `user-uploads://循环.mp4` → `public/videos/loop.mp4`

### 2. 替换卡片背面图片
- 复制 `user-uploads://output_4e65a54f-dc34-46ba-a752-6ccd87eb0b0b-2.jpg` → `src/assets/card-back.jpg`（覆盖现有文件）

### 3. 修复翻转动效 — `src/index.css`
- 把 `cardFlight` 和 `cardFlip` 合并成一个动画，或者让 cardFlight 同时包含 scale 和位移，cardFlip 只做 rotateY
- 关键：cardFlight 的 scale 从 0.06 → 1 的过程和 cardFlip 的 rotateY 180 → 0 需要同步进行，实现"边放大边翻转"
- 调整缓动曲线为更丝滑的 `cubic-bezier(0.25, 0.1, 0.25, 1)`

### 4. 修复图片预加载 — `src/pages/Index.tsx` + `src/components/TemplateCard.tsx`
- TemplateCard 的 `<img>` 改为 `decoding="sync"` 确保命中预加载缓存
- 确保飞行层中的 TemplateCard 只在 `imagesReady` 后才渲染

### 5. 视频持续播放 — `src/pages/Index.tsx`
- 给 loop 视频加 `loop` 属性
- `handleLoopEnded` 改为只在第一次触发时设置 `cards-fly`，不再手动 `play()`
- 注意：加了 `loop` 后 `onEnded` 不会再触发，所以改用 `onTimeUpdate` 检测第一次播放完成（`currentTime` 接近 `duration`）

### 6. 蒙层模糊修复 — `src/components/TemplateCard.tsx`
- 问题根因：卡片在飞行层中处于 `preserve-3d` + `backface-visibility: hidden` 的子树中，`backdrop-filter` 在这种 3D 上下文中会被浏览器忽略
- 解决：在 TemplateCard 最外层加 `transform: translateZ(0)` 创建独立的 stacking context（已有），但需要确保 `isolate` class 生效
- 同时检查 Layer 2 的 mask-image 写法是否正确

### 涉及文件

| 文件 | 改动 |
|---|---|
| `public/videos/intro.mp4` | 替换为用户上传的首次2K.mp4 |
| `public/videos/loop.mp4` | 替换为用户上传的循环.mp4 |
| `src/assets/card-back.jpg` | 替换为用户上传的扑克牌背面图 |
| `src/pages/Index.tsx` | loop 视频改用 `loop` + `onTimeUpdate`；图片预加载逻辑优化 |
| `src/index.css` | cardFlight/cardFlip 关键帧调整，实现边放大边翻转 |
| `src/components/TemplateCard.tsx` | `decoding="sync"`；确保蒙层在 3D 上下文中稳定 |

