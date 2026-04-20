## 分析（无痕模式下的实际问题）

1. **Tab 切换无横滑动效**：当前 active 下划线是直接 mount/unmount 的 `<span>`，没有平滑过渡。需改为单一全局下划线条，用 `transform: translateX + width` 做横向滑动。
2. **卡片背面/翻转放大动效消失**：`cardFlip` keyframe 现在是 0→180→360（连续旋转），并且 `FlippableCard` 的 back face 用 `rotateY(180deg)` + `backface-visibility: hidden`。这会导致：动画从 0 度开始时，背面其实正对镜头但被 backface-hidden 隐藏，前面也因为是 0 度直接显示——所以"从背面翻到正面"的视觉根本没出现。需要 cardFlip 从 `rotateY(180deg) scale(0.1)` 起步，到 `rotateY(360deg) scale(1)` 结束，并在飞入容器同步 scale。同时 FlippableCard 的 back face 必须正对初始 180 度。
3. **视频 1 → 视频 2 切换黑屏**：当前 `loop.mp4` 是 `preload="none"`，要等 intro `onCanPlay` 后才开始下载。无痕模式下 loop.mp4 几乎肯定还没下载完，intro 播完时 loop 还在缓冲，就出现黑屏。修复：intro `onPlaying`（真正开始播放）时立即开始预加载 loop；intro `onTimeUpdate` 在剩余 < 1.5s 时调用 `loop.play()` 并把 loop 提前淡入叠加在 intro 上方；intro `onEnded` 才隐藏 intro。这样切换 0 黑屏。
4. **卡片图片卡顿**：当前虽然有 `preloadTemplateImages`，但 `imagesReady` 只在 `useEffect` 内 setState，而飞入触发条件 `loop onPlaying` 时会 fallback 用 `setInterval` 轮询；并且 5 张新图（template-09/10/11 等）首次 decode 大体积。需要：飞入门控严格 `imagesReady && loop已开始播放` 都满足，去掉 fallback 立即触发；并且预加载里加大并发并 await 全部 decode。

## 改动方案

### 1. `src/components/CreationPanel.tsx` — Tab 横滑动效

- 用 `useRef` 收集每个 tab 按钮的 DOM
- 一个绝对定位的 `<span>` 作为全局下划线，根据 active tab 的 `offsetLeft` / `offsetWidth` 设置 `transform: translateX(...)` 和 `width`
- `transition: transform 0.3s, width 0.3s cubic-bezier(0.4,0,0.2,1)`
- 移除每个按钮内的独立下划线

### 2. `src/index.css` — 翻转 + 缩放同步动效

- `cardFlight` 关键帧只负责位移与不透明度（保持不变）
- `cardFlip` 重写为：
  ```
  0%   { transform: rotateY(180deg) scale(0.1); }
  60%  { transform: rotateY(90deg) scale(0.6); }
  100% { transform: rotateY(0deg) scale(1); }
  ```
  - 起点是背面（180度）+ 极小尺寸
  - 中段半侧面 + 半尺寸
  - 终点正面 + 全尺寸 → 实现"从输入框上方出现，边翻转边放大到落点"

### 3. `src/components/FlippableCard.tsx` — 确保背面在 180 度时可见

- 保持 front face 默认 0 度、back face `rotateY(180deg)`、都 `backface-visibility: hidden`
- 容器 `transformStyle: preserve-3d`（已是）
- 完整动效时长延长到2.4秒
- 不动其他

### 4. `src/pages/Index.tsx` — 视频无缝切换 + 卡片 ready 严格门控

- intro `onPlaying`：立即设置 `loop.preload = "auto"; loop.load()`
- intro 新增 `onTimeUpdate`：当 `duration - currentTime < 1.2s` 且 loop `readyState >= 3` 时，开始播放 loop 并设置 `phase = "loop"`（提前切换，保持 intro 还在显示直到 ended）
- intro `onEnded`：兜底确保已切到 loop
- 让 loop 视频的 opacity 在 phase !== 'intro' 时为 1（已是）
- 保证两层视频在交叉淡入时无黑帧
- 飞入触发：去掉 setInterval fallback，直接用 `useEffect([phase, imagesReady])`，两者都满足时触发飞入；imagesReady 在 mount 时就开始 decode 5 张图
- `cardFlip` 时长与 `cardFlight` 一致（2.4s），动画结束后直接展示落定卡片

### 5. 涉及文件汇总


| 文件                                 | 改动                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `src/components/CreationPanel.tsx` | Tab 改为单一滑动下划线                                                                |
| `src/index.css`                    | 重写 `cardFlip`：rotateY 180→0 + scale 0.1→1 同步                                 |
| `src/pages/Index.tsx`              | intro `onPlaying` 立即预加载 loop；`onTimeUpdate` 提前启动 loop 实现无缝；飞入严格等 imagesReady |
| `src/components/FlippableCard.tsx` | 微调确保 back face 在 180° 时正对镜头（必要时）                                             |


### 不动

- 视频文件本身（已压缩过）
- 卡片数量、布局、尺寸
- 玻璃材质、颜色、其他控件位置

## 验收标准（无痕浏览器）

1. 点击 Stories ↔ Audiobooks，下划线横向滑动过渡
2. 卡片从输入框上方位置出现时，明显看到背面（蓝色扑克牌）→ 翻转 → 放大 → 落到正面
3. 视频 1 播完瞬间无缝过渡到视频 2，无黑屏
4. 5 张卡片图片随容器一起出现，无任何"图片后补"的卡顿