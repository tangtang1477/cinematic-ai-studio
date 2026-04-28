## 移动端改造方案（< 768px，桌面端 0 改动）

仅修改在 `useIsMobile()` 为 true 时生效的分支，桌面端代码路径完全保留。

---

### 1. 重构底部导航栏 `MobileBottomNav.tsx`（按 Figma 还原）

Figma 750px 设计稿按比例缩到移动视口（÷2 倍数适配），目标：

- 容器：黑色 `#000000`、整行 100% 宽、高度 50px（Figma 100px ÷ 2），顶部 2px 描边 `rgba(255,255,255,0.2)`
- 5 等分布局：Home / Toolkit / Create(中央凸起) / Assets / Profile
- 中央 Create：白色圆形 52px（Figma 104 ÷ 2），`top: -25px` 凸出导航栏外，内含黑色 `+` 图标
- 其他 4 项垂直居中：图标 24px + 文字 12px，`gap: 4px`
- 状态：
  - 选中：`opacity: 1`，文字 + 图标白色
  - 默认：`opacity: 0.5`
  - 当前演示路由 `/` → "Channel" 字段在 Figma 中没有，按用户要求把 Home 设为当前选中，其他 4 项默认态
- 交互：点击切换 active 状态（本地 `useState`），中央 `+` 触发 `onCreateClick`（暂留空回调）
- 字体：`SF Pro`，size 12px line 15px（Figma 24/30 ÷ 2）
- 移除 4 项中冗余的 channel icon，使用 Figma 列表（home / toolkit / create / assets / profile），用 lucide 图标兜底（Home, Wrench, Plus, Library, User），保留现有 `iconHome / iconToolkit / iconAssets` SVG 资源若可用

### 2. 移动端去掉视频背景与主标题副标题（`Index.tsx`）

仅在 `isMobile` 为 true 时：
- 三个 `<video>` 与 poster `<img>`、深色 overlay 全部不渲染
- 隐藏 `<HeroSection>`（intro 与 ready 阶段都不渲染）
- 跳过 `intro → loop → cards-fly` 的视频驱动流程：直接进入 `ready`，让 `cardsSettled = true`、`showPanel = true`，确保创作面板和卡片栅格一进页面就可见
- 桌面端仍按原逻辑播放视频与 hero 文案

### 3. 移动端改为 Channel(Lab) 频道页（新增 `MobileChannelPage.tsx`）

按 Figma 还原，结构：

```text
┌─ topbar 44px ─────────────────────┐
│ MovieFlow logo  ·  🪙 320  · 🔔   │
├─ tabs 28px ───────────────────────┤
│ For You    Lab●    AIdeo World    Fun│
│            ━━━ (青色发光下划线)        │
├─ category chips 横滑 ─────────────┤
│ [3D] [Live-action] [Image Play]    │
│ [Narrative] [MV] [Education] [...]│
├─ 2 列瀑布流 ────────────────────── │
│ [img]  [img]                       │
│ [img]  [img]   每张 3:4，圆角 16px │
│   ⋮     ⋮      右上角播放按钮       │
└────────────────────────────────────┘
```

具体细节：
- **顶部栏**：黑底 44px，左侧 `MovieFlow` 青色 18px 粗体；右侧积分图标 + `320` + 通知铃铛
- **顶部 Tabs**：4 个 — `For You` / `Lab` / `AIdeo World` / `Fun`，仅 `Lab` 选中态（白色 + 青色 24px 圆角下划线 + 模糊光晕），其他三个 `opacity:0.5`，可点击切换
- **分类按钮排（横向滚动）**：顺序按用户要求 **3D, Live-action 提前**：
  `3D` → `Live-action` → `Image Play` → `Narrative` → `MV` → `Education` → `Commercial` → `2D`
  - 默认：`bg rgba(255,255,255,0.1)`，文字 `rgba(255,255,255,0.7)`
  - 选中：`bg #71F0F6`，文字黑色，背景模糊光晕
  - 单选切换 `useState`，初始默认选中 `3D`
- **卡片网格**：复用 `templates` 数据 + `templateImagesAlt` 凑足 8–10 张，2 列 grid，gap 12px，水平 padding 16px
  - 每张：3:4 图、`borderRadius: 16px`
  - 右上角 24px 圆形毛玻璃 Play 按钮（`bg rgba(0,0,0,0.2)` + `backdrop-blur 5px` + 三角图标）
  - 点击播放按钮 → 暂留 console（不接入实际播放）
- **底部留 60px 安全区**避免内容被 `MobileBottomNav` 遮挡

### 4. `Index.tsx` 路由分流

在组件顶部：

```tsx
if (isMobile) return <MobileChannelPage />;
```

桌面端原渲染逻辑完全不变。

---

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/MobileBottomNav.tsx` | 重写：5 项布局、中央 Create 凸起按钮、顶部分隔线、active 状态切换 |
| `src/components/MobileChannelPage.tsx` | 新建：topbar + Tabs + 分类胶囊（3D/Live-action 提前）+ 2 列卡片网格 |
| `src/pages/Index.tsx` | `isMobile` 时直接 return `<MobileChannelPage />` + `<MobileBottomNav />`；桌面端逻辑保持原状 |

## 验收

1. 桌面端（≥ 768px）：与当前完全一致（视频、扇形卡片、CreationPanel 都不变）
2. 移动端（< 768px）：进入即看到 Channel/Lab 频道页 — 顶部 MovieFlow 栏、Lab 选中的 Tabs、3D 选中的分类胶囊（3D 与 Live-action 在最前）、2 列卡片网格
3. 底部导航 5 项布局精确还原 Figma：Home 当前选中、中央 Create 凸起白色圆按钮、其余项 50% 透明
4. 分类胶囊点击可切换选中态；Tabs 点击可切换选中态
