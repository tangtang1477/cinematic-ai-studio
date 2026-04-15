
目标：这次只改你指出的 4 个点，并且按“结构重做”处理，不再继续在现有错误结构上微调。

1. 固定标题和卡片舞台位置，不再跟随输入框下移 — `src/pages/Index.tsx`
- 现状问题：`stageTop = showPanel ? 64 + panelHeight + 64 : 31%`，所以输入框一出现，标题和卡片必然整体下移。
- 改法：把非 intro 阶段的标题+卡片舞台改成固定锚点，不再依赖 `panelHeight`、`showPanel`。
- 结果：输入框出现后，标题和卡片位置保持不动；输入框只覆盖自己的顶部区域，不再推舞台。

2. 彻底重做卡片飞入为“真实 4 起点 + 真实翻转” — `src/pages/Index.tsx` + `src/components/FlippableCard.tsx` + `src/index.css`
- 现状问题：
  - 现在只是每张卡片外层做位移/缩放，不是“从顶部 4 个不同位置飞入”。
  - 现在的翻转不是真正能看到背面的双面翻牌结构，`showFront` 也没实际参与动画。
- 改法：
  - 拆成两层：
    - 飞行层：`position: fixed` 覆盖页面，只负责动画
    - 落地层：动画结束后才显示，只负责静态扇形和 hover
  - 4 张卡片都从页面顶部同一高度起飞，但使用 4 个不同 X 起点，模拟视频里的扑克牌位置。
  - 外层只负责 `translate + scale + blur + opacity` 飞行。
  - 内层单独做 `rotateY(180deg) -> 0deg` 的 3D 翻牌，这样能明确看到“背面 -> 正面”的过程。
  - 终点不再写死 `55vh` 这种近似值，而是用落地层卡槽的真实页面坐标作为终点。
- 结果：卡片会真正从顶部四处分散飞入，并在飞行中完成明显的翻转放大，最后精准落到当前扇形位置。

3. 修复背面花纹未显示 — `src/components/CardBack.tsx` + `src/components/FlippableCard.tsx`
- 现状问题：背面虽有组件，但当前 3D 结构和动画职责错位，导致背面视觉没有稳定显示。
- 改法：
  - 保留你上传的牌背图。
  - 把正反面都放进统一的 3D 卡片内核，设置稳定的 `preserve-3d / backface-visibility`。
  - 由内层 rotator 控制翻转，而不是靠外层位移容器顺带旋转。
- 结果：翻转过程中会先看到背面，再顺滑翻到正面，不会再“只有正面”或“背面不出现”。

4. 修复卡片图片加载卡顿 — `src/pages/Index.tsx` + `src/components/TemplateCard.tsx`
- 现状问题：你看到的卡顿核心是图片解码时机，不是容器位移本身。
- 代码里还有控制台警告：`fetchPriority` 传法不对；另外不该给函数组件传 ref。
- 改法：
  - 在 loop 阶段提前 preload + decode 4 张模板图，全部 ready 后才允许飞行动画开始。
  - `TemplateCard` 去掉当前错误的图片优先级写法，改成稳定的 eager/decoded 策略。
  - 所有测量 ref 都挂在真实 DOM wrapper 上，不再传给 `TemplateCard` / `CardBack` 这类函数组件。
- 结果：飞行时正面图已经解码完成，不会再边飞边卡；控制台警告也一起清掉。

5. 恢复并锁定卡片蒙层上边缘模糊，不再被动画结构破坏 — `src/components/TemplateCard.tsx`
- 现状问题：当前只有“深色渐变 + 底部 blur 层”，缺少真正的上边缘模糊过渡层，所以你看到上边缘模糊仍然不存在。
- 改法：
  - 把蒙层固定为三层稳定结构：
    1. 底部暗色渐变承载层
    2. 单独的上边缘模糊过渡层
    3. 最底部玻璃 blur 层
  - 这部分与飞行动画解耦，不再因为 3D transform 调整而反复被改坏。
- 结果：卡片正面的蒙层上边缘会重新出现自然的模糊渐变，并保持稳定。

6. 具体涉及文件
- `src/pages/Index.tsx`
  - 去掉 `panelHeight/showPanel` 驱动的舞台下移
  - 重做飞行层 / 落地层
  - 用真实落点坐标驱动飞入
  - 图片 preload + decode 完成后再触发动画
- `src/components/FlippableCard.tsx`
  - 改成真正的双面 3D rotator 结构
- `src/components/CardBack.tsx`
  - 保留上传牌背图，保证背面稳定显示
- `src/components/TemplateCard.tsx`
  - 修复图片加载策略
  - 恢复并锁定上边缘模糊蒙层
- `src/index.css`
  - 重写飞行与翻牌关键帧，分离外层飞行和内层翻转

技术说明
- 当前失败的根因不是“数值不对”，而是 4 个结构性问题：
  1. 舞台位置被输入框状态驱动，所以会下移
  2. 飞行和翻转混在一个层上，所以看不到真实背面翻牌
  3. 终点是估算值，不是真实卡槽坐标，所以像突然出现
  4. 图片没有在动画前解码完成，所以飞行时卡顿
- 下一步会按这个结构一次性改对，而不是继续补丁式微调。
