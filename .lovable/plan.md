目标：按你现在复现出来的真实问题做一次“根因级”修正，不再继续猜缓存。重点解决 3 件事：无痕模式首屏黑屏、视频1冷启动卡顿、卡片翻转背面仍发黑且出现时卡顿。

我已确认的根因

1. 视频1黑屏久

- `index.html` 里没有任何首屏静态占位，页面在 React 挂载前只能先显示黑底。
- `src/pages/Index.tsx` 现在是进页面后再渲染 poster + video，所以无痕冷缓存下会先看到长时间黑屏。

2. 视频1播放卡顿

- 当前一进页面就对 `intro.mp4` 和 `loop.mp4` 同时 `load()`，而且两个 `<video>` 都是 `preload="auto"`。
- 在无痕模式冷缓存下，这会导致两个视频抢带宽；视频1还没播顺，视频2已经开始预拉流，所以 intro 更容易卡。
- 另外现在仅靠浏览器默认解码与缓冲，没有“只优先保证视频1先顺滑播放”的策略。

3. 卡片背面仍是黑色

- 我已核对：`src/assets/card-back.jpg` 现在就是你附件里的蓝色扑克牌图，资源本身没错。
- 所以问题不是图片文件，而是当前翻转结构：
  - 外层在做 3D 动画
  - `FlippableCard` 内又是 `preserve-3d`
  - front/back 自身还叠了 `translateZ(0.1px)`、`overflow:hidden`、多层子节点
- 这类组合在浏览器里很容易出现 backface 被吞掉，结果视觉上就是“背面发黑/空白”。

4. 卡片出现卡顿、预加载不够

- 现在只是对模板图做了 `new Image().decode()`，但真正飞入时仍要同时做：
  - 4 张卡片的 transform 动画
  - 4 个 3D 翻转
  - 外层 blur/filter
  - 内层图片首次合成与绘制
- `cardFlight` 关键帧里还用了 `filter: blur(...)`，这是最容易造成掉帧的点之一。
- 所以不是“没 preload 一行代码”，而是动画方案本身太重。

改动方案

一、首屏黑屏与视频1卡顿修复 — `index.html` + `src/pages/Index.tsx`

1. `index.html`

- 在 React 挂载前先放一个全屏首帧占位层，直接用 intro poster 做首屏背景。
- 这样无痕模式下页面一打开就先看到画面，不再先黑屏。

2. `src/pages/Index.tsx`

- 改视频加载优先级：
  - 初始只让 `intro.mp4` 进入预加载/播放准备
  - `loop.mp4` 不再在首屏同时 `load()`
  - 等视频1将结束前或结束后，再启动视频2加载
- `introReady` 不再只靠 `onCanPlay`，会把“poster 已显示”和“video 可播”拆开，避免等待视频解码期间再次黑屏。
- 保持你现在正确的交互逻辑不变：视频1播完，视频2一开始播放，卡片就开始出现。

二、卡片背面黑色修复 — `src/components/FlippableCard.tsx` + `src/components/CardBack.tsx`

1. 不再沿用当前容易出错的双层 3D 嵌套写法。
2. 改成更稳定的结构：

- 一个 rotator 负责唯一的 `rotateY`
- front/back 两个 face 只做最小必要 transform
- 去掉 face 内多余的 `translateZ(0.1px)` 链式叠加
- 减少会触发合成异常的 `overflow + preserve-3d + nested img/background` 组合

3. `CardBack.tsx`

- 直接以你附件这张牌背图为唯一视觉源来渲染
- 不保留白边、只完整铺满图片内容
- 去掉容易导致背面发黑的冗余背景层叠，避免“黑底 + 图片层”互相打架

三、卡片出现卡顿修复 — `src/index.css` + `src/pages/Index.tsx` + `src/components/TemplateCard.tsx`

1. `src/index.css`

- 重写 `cardFlight`：
  - 去掉 `filter: blur(...)` 动画
  - 改为只用 `transform + opacity`
- 保留视觉上的“远到近/逐渐清晰”效果，但不用高代价的 blur。

2. `src/pages/Index.tsx`

- 卡片出现前，严格等模板图资源 ready 后再挂载飞入层。
- 如果需要，会把飞入与翻转稍微错峰，避免同一帧同时启动过多重动画。

3. `src/components/TemplateCard.tsx`

- 让飞入阶段的卡片正面走最轻量渲染路径，减少 hover 层、按钮层、文本层对首帧动画的影响。
- 落地后再恢复完整交互层。

不会改的部分

- 你说“其他都正确不要修改”的部分我会保持：
  - 视频切换逻辑
  - 已经正确的整体布局
  - 已经正确的蒙层方向与内容结构（除非为性能需要只做最小范围拆分）
- 本次只动与这 3 个问题直接相关的文件。

预计涉及文件

- `index.html`
- `src/pages/Index.tsx`
- `src/components/FlippableCard.tsx`
- `src/components/CardBack.tsx`
- `src/components/TemplateCard.tsx`
- `src/index.css`

验收标准

1. 无痕打开后，首屏立即看到 poster，不再长时间纯黑。
2. 视频1开始播放更快，明显减少冷启动卡顿。
3. 卡片翻转时背面稳定显示为你附件里的蓝色扑克牌背面，不再发黑。
4. 卡片出现更顺，不再有明显首帧顿挫。