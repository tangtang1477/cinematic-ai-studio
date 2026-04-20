## 参考动效（Aideo Studio AnnouncementModal flyOut）

```
transform: scale(1) translate(0,0)  →  scale(0.05) translate(dx,dy)
opacity: 1 → 0
transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1),
            opacity   0.55s ease 0.15s
```

特点：单一 transform 链（translate + scale 在同一属性里）、平滑的 Material ease、opacity 比 transform 晚 0.15s 起步形成"先飞再淡"的层次。

## 反向移植到 5 张卡片飞出（current project）

将 `FlyingCardsScene.tsx` 的飞入动效改为严格按 Aideo Studio 镜像：

**起点（source）**：每张卡片从输入框顶部不同点出发：card1: x = -160, y = same startY，card2: x = -80, y = same startY，card3: x = 0, y = same startY，card4: x = 80, y = same startY，card5: x = 160, y = same startY

- `transform: translate(0,0) scale(0.05)`
- `opacity: 0`
- `rotateY: 180deg`（背面朝前）

**终点（target）**：扇形落位

- `transform: translate(dx,dy) scale(1)`
- `opacity: 1`
- `rotateY: 0deg`（正面）

**transition（镜像 Aideo + 拉长到 2.4s + 加翻转）**

```
transform:  2.4s cubic-bezier(0.4, 0, 0.2, 1)
opacity:    1.6s ease 0.2s         ← 比 transform 晚起步，先飞再显
rotateY:    1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.6s
            ↑ 0.6s 后开始翻，到 2.0s 翻转完成
            前 25% 时间纯背面飞行 → 中段同步翻转 → 末段定格正面
```

**翻转节奏（关键）**

- 0 → 0.6s：背面 + 极小，"从输入框生出"，纯位移+放大，背面清晰可见
- 0.6 → 2.0s：边飞、边放大、边翻转
- 2.0 → 2.4s：正面定格，轻微 ease-out 收尾

**stagger**：50ms（5 张总跨度 200ms，保持"一组"感）

## 改动方案

抛弃当前 Framer Motion 多层 motion 实现，改用 Aideo Studio 同款**单层 CSS transition**：

### `src/components/FlyingCardsScene.tsx` 重写

结构保留 3 层（wrapper / 3d-stage / inner + front/back），但动画机制改成：

1. 组件 mount 时所有卡片初始 style = source state（scale 0.05, opacity 0, rotateY 180）
2. `requestAnimationFrame` 后切到 target state，触发 CSS transition
3. transition-delay 实现 stagger（`${i * 0.05}s`）
4. 监听最长的 transform transitionend 触发 `onAllSettled`

去除：framer-motion 依赖（保留也行，但本次不再使用）、glow trail（与 Aideo 风格不符，纯净飞出）、多 motion.div

保留：

- 落定火花粒子（`LandingSparkle`，落位时刻触发）
- per-card perspective 1200px
- backface-visibility 双面
- 3:4 卡片比例

### `src/pages/Index.tsx`

- 触发延迟保留 250ms
- `onAllSettled` 回调保留

### 不动

视频逻辑、TemplateCard、CardBack、扇形落定布局、CreationPanel、HeroSection

## 涉及文件


| 文件                                    | 改动                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/components/FlyingCardsScene.tsx` | 改用单层 CSS transition（Aideo 同款 cubic-bezier(0.4,0,0.2,1)），duration 2.4s，opacity 延迟起步，rotateY 在 0.6s~2.0s 完成翻转 |


## 验收（无痕）

1. 5 张卡片从输入框中央同一点出发（scale 0.05, 不可见, 背面）
2. 前 0.6s：纯放大 + 飞出 + 渐显，背面清晰可见
3. 0.6~2.0s：边飞边翻边放大
4. 2.0~2.4s：正面定格，落位火花
5. 整体 2.4s，节奏与 Aideo Studio 弹窗缩小飞入完全镜像，丝滑高级