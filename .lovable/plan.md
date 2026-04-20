## 分析

1. **视频1首帧卡顿**：`intro.mp4` 文件太大，需要压缩成更小的 1080p 版本并启用 faststart。
2. **卡片翻转动效消失 + 卡顿**：上次为修背面把 `cardFlip` 翻转动画移除了，需要恢复；图片卡顿是因为飞入时还在解码。需要在 `imagesReady` 完成后再触发飞入。
3. **卡片背面**：再次用用户上传的扑克牌图覆盖 `src/assets/card-back.jpg`（之前可能损坏）。
4. **卡片数量 5 张**：在 `templates.ts` 添加第 5 张（复用现有图或新增），并扩展 `CARD_FINAL_TRANSFORMS` / `CARD_FLY_ORIGINS` 数组。
5. **输入框 Tab 切换**：在 `CreationPanel.tsx` 顶部加 参考图2中"Video Agent / AI Video" 风格的 tab，命名为「 **Stories** /**Audiobooks**」：
  - 默认 tab = 故事：隐藏旁白开关（Voiceover）
  - 有声读物 tab：隐藏时长选项，把 Voiceover 开关换成「Voice」下拉
  - 其他样式保持不变

## 改动文件


| 文件                                 | 改动                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `public/videos/intro.mp4`          | ffmpeg 压缩到 720p + faststart，目标 < 5MB                                      |
| `src/assets/card-back.jpg`         | 用 user-uploads 中扑克牌图覆盖                                                    |
| `src/components/FlippableCard.tsx` | 恢复 rotateY 翻转动画（CSS keyframe），保持稳定 backface                               |
| `src/index.css`                    | 恢复 `cardFlip` keyframe（rotateY 0→180），`cardFlight` 保持轻量                   |
| `src/data/templates.ts`            | 增加第 5 张模板                                                                 |
| `src/pages/Index.tsx`              | `CARD_FINAL_TRANSFORMS` / `CARD_FLY_ORIGINS` 扩展为 5 项；飞入严格等待 `imagesReady` |
| `src/components/CreationPanel.tsx` | 顶部加 Tab（故事/有声读物），按 tab 切换显示时长 / 音色 / 旁白                                   |
| `src/pages/Index.tsx`              | 传入 `mode` state（默认 `story`），`handleTry` 时重置为 `story`                      |


## 技术细节

- **视频压缩**：`ffmpeg -i intro.mp4 -vf scale=-2:1080 -c:v libx264 -crf 28 -preset slow -movflags +faststart -an intro_new.mp4`
- **翻转动画**：在飞入容器内层 div 上用 `animation: cardFlip 2.4s ... both`，keyframe `0% { transform: rotateY(180deg) } 100% { transform: rotateY(360deg) }`，配合 FlippableCard 的 backface 设置即可正面着陆。
- **第5张模板**：复用一张现有图片或选 templates 中视觉差异大的；若无新图，先用 `template-11` 做占位，命名 "Cyberpunk Noir"。
- **CreationPanel Tab**：
  - 左上角文字 tab："Stories" 加下划线高亮 + "Audiobooks"
  - `mode === 'audiobook'`：隐藏 duration chip、隐藏 voiceover 开关、显示「Voice」Select（选项：温柔女声 / 沉稳男声 / 活力少年 / 知性女声）
  - `mode === 'story'`：隐藏 voiceover 开关，显示 duration
- 不动：颜色、玻璃材质、其他控件位置和样式

## 验收

1. 视频1开播无明显首帧卡顿
2. 卡片飞入时有 rotateY 翻转动效，背面显示蓝色扑克牌
3. 卡片为 5 张扇形排列
4. 输入框顶部有「故事 / 有声读物」tab，切换时控件按规则显示/隐藏