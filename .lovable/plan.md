
目标：这次不再继续微调现有实现，而是按你现在指出的 3 个问题做一次结构性修正：视频切换时机、卡片背面与正面加载、蒙层模糊层解耦。

1. 视频2替换并改成交错出现逻辑 — `src/pages/Index.tsx` + 资源文件
- 现状我已核对：现在逻辑是等视频2快播完第一圈时才触发 `cards-fly`，不符合你要的“视频1播完后，视频2刚开始播放时卡片就逐渐出现”。
- 改法：
  - 用你新上传的 `最终版.mp4` 替换 `public/videos/loop.mp4`
  - 把触发时机从当前 `onTimeUpdate + duration - 0.15` 改成视频2开始播放时立即进入卡片出现流程
  - 卡片不再等“视频2快播完”才出现，而是在视频2开始后就执行淡入/飞入
- 结果：视频1播完后立刻切到新视频2，卡片随着视频2开头就开始出现

2. 卡片背面空白：重做双面卡结构，不再在页面里手写正反面 — `src/pages/Index.tsx` + `src/components/FlippableCard.tsx` + `src/components/CardBack.tsx`
- 现状我已核对：
  - `Index.tsx` 里现在直接写了一套 front/back 绝对定位结构
  - `FlippableCard.tsx` 虽然存在，但根本没被用上
  - 背面空白的高概率根因不是图片没引，而是当前 3D 层级和翻转职责散在页面里，正反面切换不稳定
- 改法：
  - 把飞行层卡片统一改为使用 `FlippableCard`
  - `FlippableCard` 只负责稳定的 3D 双面结构：外层 perspective，内层 rotator，front/back 统一管理
  - `CardBack` 使用你附件里的扑克牌图样，保留白边牌框，但把牌背图片改成更稳定的 `img`/明确尺寸铺满方式，避免仅靠背景图导致的空白感
- 结果：翻转过程中会稳定看到牌背，不再出现“背面空白”

3. 正面模板图依旧卡顿：把“预加载”和“实际渲染”彻底打通 — `src/pages/Index.tsx` + `src/components/TemplateCard.tsx`
- 现状我已核对：
  - 虽然有 `new Image().decode()`，但 `TemplateCard` 仍直接渲染 `<img src={template.image}>`
  - 这意味着即使浏览器缓存了资源，也可能在真正挂载卡片时再次发生绘制/解码抖动
- 改法：
  - 在 `Index.tsx` 中把图片预加载状态细化为“全部模板图已完成 decode 后才允许渲染飞行层正面”
  - 在飞行动画期间，不再立即把真实 `TemplateCard` 作为正面内容硬挂上去；而是只在 `imagesReady` 后才渲染真实正面
  - `TemplateCard` 里继续保持 eager，但要补一层可控 ready 态，避免未 ready 时直接出图
- 结果：卡片飞入时正面图已完成解码，不再边出现边卡

4. 蒙层模糊依旧错误：把 blur 蒙层从 3D 翻转子树里拿出去 — `src/components/TemplateCard.tsx` + `src/components/FlippableCard.tsx`
- 现状我已核对：你说得对，当前 `TemplateCard` 的模糊层还在卡片内容内部，而这张卡又被放进 `preserve-3d` 的翻转结构里；这种情况下 `backdrop-filter + mask-image` 在浏览器里非常容易失效或表现错误。
- 改法：
  - 不再让承担 `backdrop-filter` 的层处于 3D 翻转子树内部
  - 把卡片拆成：
    1. 纯图片内容层
    2. 独立的文字/模糊蒙层
    3. 外层 hover/点击容器
  - 对“上边缘渐变模糊层”单独做一层，并确保它所在节点不参与 `rotateY`
- 结果：蒙层上边缘的渐变模糊会恢复，而且不会再被翻转动画反复破坏

5. 本次涉及文件
- `public/videos/loop.mp4`
  - 替换为你上传的 `最终版.mp4`
- `src/pages/Index.tsx`
  - 修改视频切换与卡片触发时机
  - 不再手写脆弱的 front/back 结构
  - 让卡片在视频2开始时就逐渐出现
  - 把正面渲染严格绑定到图片 ready 状态
- `src/components/FlippableCard.tsx`
  - 改成真正被页面使用的双面卡组件
  - 稳定处理 front/back 与 rotator
- `src/components/CardBack.tsx`
  - 用你附件中的扑克牌样式重做牌背展示
- `src/components/TemplateCard.tsx`
  - 重构图片层与蒙层层级
  - 修复上边缘渐变模糊

技术说明
- 这 3 个问题的根因都不是“参数没调好”，而是当前结构错位：
  1. 视频触发点写成了“loop 快结束”，不是“loop 刚开始”
  2. 双面卡结构没复用 `FlippableCard`，导致背面显示不稳定
  3. blur 蒙层仍在 3D 翻转上下文里，所以浏览器会吞掉或错误渲染 `backdrop-filter`
- 下一步会按这个结构重做，而不是继续补几个 CSS 数值。
