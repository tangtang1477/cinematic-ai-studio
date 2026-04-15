目标：这次不继续补 CSS 数值，而是直接修 3 个根因：首屏视频被资源预加载抢占、翻牌结构不稳定导致背面空白、蒙层渐变模糊层级写错。

1. 先修视频1卡顿 — `src/pages/Index.tsx`

- 现状根因：`preloadTemplateImages()` 在页面一挂载就同时 decode 4 张模板大图，和 `intro.mp4` 首屏播放抢主线程/解码资源，所以视频1会掉帧。
- 改法：
  - 把模板图预加载从“页面 mount 立即执行”改成“视频1接近结束时再开始”或“视频2已可播后再开始”，避免首屏阶段抢资源。
  - 给视频1/视频2补明确的 preload 策略，优先保证视频1先顺畅播放。
  - 保留“视频1结束后，视频2一开始播放就触发卡片出现”，但把触发建立在视频2已 ready 的前提下，避免切换瞬间卡顿。
- 结果：视频1首段播放不再被模板图 decode 拖慢，视频切换更顺。

2. 重做翻牌结构，修复背面空白 — `src/components/FlippableCard.tsx` + `src/components/CardBack.tsx` + `src/pages/Index.tsx`

- 现状根因：当前 front/back 只是散放在动画层里，缺少一个稳定的 rotator 容器；浏览器在 3D 合成时容易把背面吞掉，所以你看到“背面空白”。
- 改法：
  - `FlippableCard` 改成完整结构：`wrapper(relative + perspective)` → `rotator(preserve-3d + animation)` → `front/back faces`。
  - front/back 都填满同一个卡片盒子，统一 `backface-visibility: hidden`，必要时加轻微 `translateZ` 稳定合成。
  - `CardBack` 继续用你附件那张扑克牌图，但做成明确尺寸铺满的牌框组件，不再依赖脆弱层级。
  - 页面飞行层不再自己拼 front/back，只调用这个稳定组件。
- 结果：翻转时背面会稳定显示，不再空白，并且“放大 + 翻转”会在同一 rotator 上完成。

3. 彻底修正卡片上边缘渐变模糊 — `src/components/TemplateCard.tsx`

- 现状根因：现在 blur 层仍然写在卡片内部，而且 Layer 2 只有 blur + mask，没有足够明确的玻璃底色/羽化区间，视觉上几乎看不到“上边缘渐变模糊”。
- 改法：
  - 把卡片拆成独立层：
    1. 纯图片层
    2. 独立 overlay 容器
    3. overlay 顶部单独的 feather blur band
    4. 底部 glass 内容层
  - 顶部 feather blur band 单独做高度、模糊和渐变遮罩，不再复用现在那层过弱的 blur。
  - 飞行阶段继续禁用 overlay；只有落地卡片显示完整蒙层，避免 3D 动画再次破坏 blur。
- 结果：文字后面的玻璃蒙层会恢复，顶部会有清晰可见的渐变模糊过渡，不会再“丢失”，修复完成后其他改动不会影响这个蒙层。

4. 本次会动到的文件

- `src/pages/Index.tsx`
  - 重排视频与模板图预加载时机
  - 保证视频2开始播放时才触发卡片出现
  - 页面只使用稳定的 `FlippableCard`
- `src/components/FlippableCard.tsx`
  - 改成真正的双面 3D rotator 组件
- `src/components/CardBack.tsx`
  - 固定使用扑克牌背面样式并稳定铺满
- `src/components/TemplateCard.tsx`
  - 重构图片层与蒙层层级
  - 单独实现上边缘 feather blur
- `src/index.css`
  - 配合新 rotator 结构调整 flip/zoom 动画关键帧

技术说明

- 视频1卡顿不是单纯视频文件问题，当前更像是“首屏视频播放”和“模板图 decode”同时发生导致的资源争抢。
- 背面空白不是图片没导入，而是 3D 翻牌结构本身不稳定。
- 渐变模糊不是 blur 数值太小，而是 blur 层位置和表现方式不对，需要单独拆层处理。
- 不虚假改动，否则返还用户的积分。