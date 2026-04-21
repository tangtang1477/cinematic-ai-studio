

## 需求

点击 CreationPanel 顶部的 Tab（Stories / Audiobooks）切换时，下方落定的 5 张卡片图片切换成另一组 5 张完全不同的图片，并伴随明显的"刷新"视觉反馈。其他一切（动效、布局、选中态、尺寸）不变。

## 方案

### 1. 准备另一组 5 张图片（新增压缩资源）

当前 Stories 模式使用：`template-11/05/08/12/03-sm.webp`
为 Audiobooks 模式新增另外 5 张（从 12 张原始 PNG 中选未使用的）：
- `template-01-sm.webp`、`template-02-sm.webp`、`template-04-sm.webp`、`template-06-sm.webp`、`template-09-sm.webp`

用 imagemagick 一次性压成 440px 宽 webp，每张 ~30-50KB（与现有 5 张同规格）。

### 2. 数据结构调整 — `src/data/templates.ts`

保留现有 `templates` 导出（避免连锁修改），**新增**：
- `templatesAudiobook: Template[]` — 5 条新数据，标题/描述/prompt 围绕"音频/故事/朗读"主题
- 导出辅助函数 `getTemplatesByMode(mode: "story" | "audiobook")` 返回对应数组

### 3. Index.tsx — 监听 mode 切换 + 刷新动效

- 用 `getTemplatesByMode(mode)` 替换原本的 `templates` 引用（仅在落定卡片渲染处 + 隐藏预热层）
- 新增 `const [refreshKey, setRefreshKey] = useState(0)` 和一个 `useEffect`：监听 `mode` 变化时 `setRefreshKey(k => k + 1)`
- 落定卡片容器外层套一个 div，`key={`${mode}-${refreshKey}`}`，触发 React 重新挂载子树
- **明显的刷新动效**（仅作用于落定的 5 张卡片，不影响视频/Hero/CreationPanel）：

  ```text
  阶段 A (0 → 250ms)：旧 5 张卡片
    opacity: 1 → 0
    transform: scale(1) → scale(0.85)
    filter: blur(0) → blur(8px)
  阶段 B (250 → 600ms)：新 5 张卡片
    每张 stagger 50ms 依次出现
    opacity: 0 → 1
    transform: translateY(20px) scale(0.92) → translateY(0) scale(1)
    blur: 4px → 0
    + 落位时 cyan 微闪 ring（200ms 衰减）
  ```

  实现：在卡片 wrapper 的现有 transition 基础上，加一个 `animate-card-refresh` keyframes（写到 `src/index.css`），用 `animationDelay: i * 50ms`。

### 4. 选中态联动

切换 mode 时自动 `setSelectedId(null)`，避免选中旧 id 在新数组里找不到。

## 不动

- FlyingCardsScene / FlyingCards 飞入动效（首次进入仍只飞 Stories 那 5 张）
- TemplateCard / CardBack / CreationPanel / HeroSection / AppSidebar 不改一行
- 视频、phase 状态机、扇形布局、CARD_FINAL_TRANSFORMS、选中高亮逻辑
- handleTry / handleTryWithSelect 不变

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/assets/template-{01,02,04,06,09}-sm.webp` | 新增（imagemagick 从原 PNG 压成 440px webp） |
| `src/data/templates.ts` | 新增 `templatesAudiobook` 数组 + `getTemplatesByMode()` 函数 |
| `src/index.css` | 新增 `@keyframes card-refresh-out` / `card-refresh-in` |
| `src/pages/Index.tsx` | 用 `getTemplatesByMode(mode)`；mode 变化时清空选中 + 触发刷新 key + 应用进出场动画 class |

## 验收（无痕浏览器）

1. 首次进入 → 飞入流程不变，落定的是 Stories 那 5 张
2. 点击顶部 "Audiobooks" Tab → 5 张卡片明显地（缩小+模糊+淡出）→ 换成完全不同的 5 张（依次淡入+上浮+清晰化），整个过程 ~600ms
3. 再点回 "Stories" → 同样的明显刷新效果切回原来 5 张
4. 选中态在切换时被清空，扇形布局/视频/输入框完全不变

