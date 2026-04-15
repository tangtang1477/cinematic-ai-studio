

## 问题分析

1. **动效太快**：当前 `cardFlight` 和 `cardFlip` 都是 1.6s，需要加长到 ~2.4s，并调整缓动曲线让放大翻转过程更明显
2. **图片预加载未生效**：虽然有 `preloadTemplateImages()`，但 `TemplateCard` 里的 `<img>` 仍然是独立加载的新请求。需要确保预加载的图片被浏览器缓存命中
3. **视频没铺满全屏**：当前视频在 `ml-[88px]` 的容器内，左边留出了侧边栏的空白。需要把视频提到最外层作为全屏背景，侧边栏浮在视频上方
4. **卡片动画时视频停止**：当前 `handleLoopEnded` 里虽然调了 `play()`，但进入 `cards-fly` phase 后可能没继续播放。需要确保 loop 视频在所有非 intro 阶段持续循环播放

## 改动方案

### 1. 视频铺满全屏 — `src/pages/Index.tsx`
- 把视频背景层从 `ml-[88px]` 的子容器中提出来，放到最外层 `div` 的直接子元素，`position: fixed, inset: 0`
- 侧边栏 `z-50` 已经浮在最上层，不需要改
- 内容区域保留 `ml-[88px]`，但视频不再受这个 margin 影响

### 2. 动效加长 — `src/index.css` + `src/pages/Index.tsx`
- `cardFlight` 时长从 1.6s 改为 2.4s
- `cardFlip` 时长同步改为 2.4s
- 调整 `cardFlip` 的中间关键帧，让翻转在 40%-65% 之间完成主要旋转，前半段停留在背面更久
- 每张卡片的错峰延迟从 60ms 改为 80ms

### 3. 图片预加载真正生效 — `src/pages/Index.tsx`
- 在 `preloadTemplateImages` 里把已解码的图片 URL 缓存到一个 module-level Set 中
- 确保在 `imagesReady` 为 true 之前不会触发 `cards-fly` phase（当前逻辑已有，需要确认没有竞态）

### 4. 视频持续播放 — `src/pages/Index.tsx`
- 给 loop 视频加 `loop` 属性，不再依赖 `onEnded` 手动 `play()`
- 去掉 `handleLoopEnded` 里的 `play()` 调用，改为：`onEnded` 只负责计数和触发 cards-fly
- 或者更简单：直接加 `loop` 属性，`onEnded` 改为 `onTimeUpdate` 检测播放次数

实际上最简单的方案：loop 视频直接加 HTML `loop` 属性让它无限循环，然后用一个单独的 `timeupdate` 或首次 `ended` 事件来触发卡片飞入。这样视频永远不会停。

### 涉及文件

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 视频层提到最外层全屏；loop 视频加 `loop` 属性；调整动画时长参数 |
| `src/index.css` | `cardFlight` 和 `cardFlip` 时长改为 2.4s，调整翻转关键帧节奏 |

