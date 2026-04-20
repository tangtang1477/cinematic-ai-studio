

## 根本原因诊断

### 问题1：视频播放卡顿（intro 卡帧 + intro→loop 黑屏）

`intro.mp4 = 5.7MB`、`loop.mp4 = 9.6MB`，**当前代码同时 `load()` 两个视频**（Index.tsx L82-87）。在无痕/冷缓存下，浏览器会平分带宽给这两个大文件，导致：
- intro 缓冲不够，开播前长时间卡帧
- intro 快结束时 loop 还没缓冲到 readyState ≥ 3，crossfade 失败，出现黑屏

### 问题2：卡片正面图片"一顿一顿地慢慢加载"

**5 张 PNG 总计 15.3MB，每张 1276×1701 全分辨率**，但实际只显示 220×293（CSS）。
- `preloadTemplateImages()` 用 `new Image() + decode()` 解码 → 但解码后的 bitmap 只挂在内存里的 detached `Image` 对象上，**浏览器并不会把它共享给后续 `<img>` 标签**
- 当 `<TemplateCard>` 真正 mount 时，浏览器会再次为 DOM 中的 `<img>` 解码这 15MB（即使有缓存也要重新 decode 1276×1701 的位图），落位瞬间触发 5 次 GPU 纹理上传 → 一顿一顿出现

### 问题3：卡片背面"始终没加载出来"

`CardBack.tsx` 用 `decoding="sync"`（L8），背面在 `rotateY(180deg)` 状态下浏览器认为**不可见**（backface-visibility: hidden），有些浏览器会**完全跳过解码**直到它真正面向用户。同时 cardBack 是 269K JPEG 在 Vite dev 下每次 hot reload 重新请求。

## 修复方案（不动任何 UI/动效逻辑）

### 1. 视频加载策略 — 串行而非并行
`src/pages/Index.tsx`：
- **删除** L82-87 同时 load 两个视频的逻辑
- intro 立即 load（保留 `preload="auto"`）
- loop **不在 mount 时 load**，在 intro 触发 `onPlaying` 时才 `loop.preload="auto"; loop.load()` —— 此时 intro 已经在播，带宽专给 loop
- loop video 标签初始 `preload="metadata"` 而非默认 auto

### 2. 模板图片 — 用 `?w=440&format=webp` Vite 内置 import 参数压缩

Vite 不内置 imagetools，但 PNG 1276×1701 实际只显示 220×293（@2x = 440×586），**改成手动预压缩**：
- 用脚本一次性生成 `template-XX-440.webp`（440px 宽，~30-50KB/张）
- 替换 `src/data/templates.ts` import 为新的 webp 文件
- 总大小从 15MB → ~250KB，解码时间从 ~200ms/张 → ~10ms/张

### 3. CardBack 解码 — `decoding="async"` + 提前预热

- `src/components/CardBack.tsx` `decoding="sync"` → `decoding="async"`
- 把 `card-back.jpg` 也压成 ~440px webp（~40KB）
- `preloadTemplateImages()` 里同时预热 cardBack（确保它在飞入开始时已 decoded 并挂在 DOM `<link rel="preload">` / `<img hidden>` 上）

### 4. 在 Index 里增加隐藏 `<img>` 预热层

在 `<div className="fixed inset-0 z-0">` 里追加一个 `display:none` 的容器，里面放 5 个 `<img src={template.image} />` + 1 个 `<img src={cardBack} />`，让浏览器**真正在 DOM 中**保留 decoded bitmap，飞入时直接命中纹理缓存，杜绝"一顿一顿"。

### 不动
- 所有动效逻辑（FlyingCardsScene 不改一行）
- 视频元素 JSX 结构、phase 状态机、卡片落定布局
- TemplateCard 内部、CreationPanel、HeroSection、AppSidebar
- CardBack 的样式和结构（只改 decoding 属性 + 图片源）

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/assets/template-XX.png` ×5 + `card-back.jpg` | 用脚本一次性压成 440px 宽 webp（~30-50KB/张），生成新文件 `template-XX-sm.webp`、`card-back-sm.webp` |
| `src/data/templates.ts` | import 路径换成新的 webp 文件 |
| `src/components/CardBack.tsx` | import 换成 webp；`decoding="sync"` → `decoding="async"` |
| `src/pages/Index.tsx` | 删除并行 load 两视频；改为 intro 优先 → onPlaying 时再 load loop；增加隐藏图片预热层 |

## 验收（无痕浏览器）

1. intro 视频几乎立刻开播，无长时间卡帧
2. intro → loop 平滑切换，无黑屏
3. 卡片飞入时背面（蓝色卡背）清晰可见
4. 落位瞬间 5 张正面同时显示，**无逐张加载、无停顿**
5. 整个页面首屏资源从 ~25MB 降到 ~6MB

