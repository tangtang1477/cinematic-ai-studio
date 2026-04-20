## 分析（无痕模式实测）

### 问题1: Tab hover 态缺失

`CreationPanel.tsx` 中 tab 按钮目前只有 active / inactive 两种颜色，没有 hover 中间态。

### 问题2: 卡片飞入早于视频2 ready，黑屏期间卡片就出现了

当前 `handleIntroTimeUpdate` 在 intro 剩余 < 1.2s 且 loop `readyState >= 3` 时，**立刻 setPhase("loop")**。然而无痕模式下：

- 如果 loop 一直没 buffer 够，`onTimeUpdate` 不会触发提前切换 → intro `onEnded` 兜底 setPhase("loop") → 此时 loop 还没下完 → 黑屏
- **关键bug**：`useEffect([phase, imagesReady])` 一旦 `phase==="loop"` 就立即触发 cards-fly，**不管 loop 视频实际是否在播放**。这就是"视频2还黑屏卡片就出现了"。

修复：飞入门控必须严格等到 **loop 视频真的 onPlaying** 触发后才开始，而不是 phase 切换瞬间。

### 问题3: 卡片背面 + 翻转放大动效仍未生效

看 `handleCardFlyEnd` 监听 `e.animationName === "cardFlight"`，但内层 div 是 `cardFlip` 动画，外层是 `cardFlight`。两层 animation 都会触发 `onAnimationEnd` 冒泡，先到的若是 `cardFlip` 会被忽略 ✓ 这是对的。

真正问题：内层 `cardFlip` 起始 `rotateY(180deg) scale(0.1)`，而外层 `cardFlight` 起始 `opacity: 0` —— 在 `opacity: 0` 阶段你根本看不到背面。`cardFlight` 关键帧 0% opacity 0、15% opacity 1，意思是前 15%（约 360ms）是隐形的，但 `cardFlip` 在这 360ms 已经从 180° 转到约 50°，背面翻转过程几乎看不到。

需要：

- 让 `cardFlight` 0% opacity 就是 1（或 0→1 在前 5% 完成），保证一开始就能看到背面
- `cardFlip` 用更慢的 easing / 更晚的中段，让背面停留时间更长（例如 0%→30% 仍接近 180°）

另外核对 `FlippableCard` 已是稳定版（rotator + 双 face backface-hidden + back rotateY 180），结构没问题。

## 改动方案

### 1. `src/components/CreationPanel.tsx`

- Tab 按钮添加 hover 态：inactive → hover → active 三档颜色
  - inactive: `rgba(255,255,255,0.4)`
  - hover: `rgba(255,255,255,0.7)`  
  - active: `hsl(var(--foreground))`
- 用 `onMouseEnter / onMouseLeave` 或纯 CSS `:hover` 实现，加 `transition: color 0.2s`

### 2. `src/pages/Index.tsx` — 严格门控飞入

- 新增 state `loopActuallyPlaying`
- `handleLoopPlaying` 中 `setLoopActuallyPlaying(true)`
- 把飞入触发 useEffect 改为依赖 `[loopActuallyPlaying, imagesReady]`：两者都 true 才 setPhase("cards-fly") + setCardsVisible(true)
- 这样无论视频2还在缓冲多久，卡片绝不会在视频2实际开播前出现
- 视频2提前加载完成，不要出现黑屏

### 3. `src/index.css` — 修复背面翻转可见性

- `cardFlight` keyframe：把 `0% opacity 0` 改为 `0% opacity 1`（飞入瞬间就可见，配合从输入框上方的起点位置自然出现）
- `cardFlip` keyframe 调整为：
  ```
  0%   { transform: rotateY(180deg) scale(0.15); }
  25%  { transform: rotateY(180deg) scale(0.35); }  /* 背面停留+放大 */
  100% { transform: rotateY(0deg)   scale(1); }
  ```
  让前 25% 保持背面可见并放大，后 75% 完成翻转到正面

### 涉及文件


| 文件                                 | 改动                                                    |
| ---------------------------------- | ----------------------------------------------------- |
| `src/components/CreationPanel.tsx` | Tab 三态颜色（含 hover）                                     |
| `src/pages/Index.tsx`              | 飞入严格等 loop 视频 onPlaying（新增 loopActuallyPlaying state） |
| `src/index.css`                    | `cardFlight` 0% opacity=1；`cardFlip` 让背面在前 25% 保持可见   |


### 不动

- 视频文件、卡片数量/布局、玻璃材质、其他控件

## 验收（无痕）

1. 鼠标悬停 Stories/Audiobooks 上有明显的中间灰白色变化
2. 视频2必须真正开播（不再黑屏）后，卡片才从输入框上方出现
3. 卡片出现时清晰可见蓝色扑克牌背面 → 翻转放大 → 正面落定