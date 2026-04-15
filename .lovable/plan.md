# 6项修改计划

## 1. 卡片蒙层修复 — `TemplateCard.tsx`

当前蒙层 `height: 120px` 太高。修改为：

- 渐变模糊过渡层高度缩小到约 60px，仅覆盖文字区域上方一小段
- 确保非 hover 状态下的文字蒙层和 hover 状态下的 Try this 蒙层样式一致（都是底部小区域 + 上边缘渐变模糊）

## 2. 视频1标题更大 + 阴影 — `HeroSection.tsx`

- intro 阶段标题字号从 `32px` 增大到 `48px`
- 添加更强的 `text-shadow`：`0 2px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.4)` 让白色字在视频背景上清晰可见
- 副标题也加黑色阴影，字号变为20px

## 3. 卡片飞入动画 + 位置上移 — `Index.tsx`

- 卡片初始位置改为从画面**上方**飞入：`scale(0.3) translateY(-60vh)` → 飞到居中偏上的扇形位置
- 卡片容器从 `items-end flex-1` 改为垂直居中，整体上移
- 确保 `cardsAnimated` 状态正确触发 CSS transition 动画

## 4. 视频2播放时保留主副标题 — `HeroSection.tsx`

当前 `cards-fly` 阶段标题就淡出了。修改逻辑：

- `intro` / `loop` / `cards-fly` 阶段都显示标题（opacity: 1）
- 仅 `ready` 阶段标题才过渡到顶部较小的位置
- `cards-fly` 时标题不淡出，让卡片在标题下方飞入

## 5. 输入框出现更丝滑 + 间距调整 — `Index.tsx` + `CreationPanel.tsx`

- 输入框距顶部 `64px`，与下方标题间距 `32px`，标题与卡片间距 `64px`
- 输入框出现动画改用更丝滑的 transition：`opacity + transform` 结合，从 `translateY(-20px) opacity(0)` 过渡到 `translateY(0) opacity(1)`，duration 600ms
- 不再用 `maxHeight` hack，改用更自然的动画方式

## 6. 替换视频2 — `public/videos/loop.mp4`

用用户上传的 `2_1.mp4` 替换当前的 `loop.mp4`。

## 修改文件


| 文件                                | 改动                         |
| --------------------------------- | -------------------------- |
| `src/components/TemplateCard.tsx` | 蒙层高度缩小，上边缘渐变一致             |
| `src/components/HeroSection.tsx`  | 标题更大+黑色阴影，cards-fly 阶段保留标题 |
| `src/pages/Index.tsx`             | 卡片飞入动画从上方、位置上移、输入框间距和动画优化  |
| `public/videos/loop.mp4`          | 替换为新视频                     |
