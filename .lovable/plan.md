# Channel Page Redesign Plan

## Issues to Fix

1. **Hero title not centered** + subtitle too small/split into two lines
2. **Color scheme too dark** — redesign without #71F0F6 cyan accent
3. **No channel page identity** — users can't tell this is a "channel" page
4. **Template cards** — change to 3:4 ratio, use uploaded images, remove tags, add frosted glass description overlay (Aideo "Inspiration Labs" style)
5. **Layout restructure** — input box fixed at bottom (like Aideo Studio video), middle area shows scrollable template content with category switching

## New Color Palette

Replace the cyan #71F0F6 accent with a warmer, more premium palette:

- Background: pure black `#000`
- Primary accent: soft violet-blue `hsl(245 58% 65%)` (#7C6BDB)
- Glass surfaces: white at low opacity
- Text: white with opacity tiers (90%, 60%, 40%)

## Layout Structure (Top to Bottom)

```text
┌──────────────────────────────────────────┐
│ Sidebar (88px)  │  Main Content Area     │
│                 │                         │
│                 │  ┌─ Hero ─────────────┐ │
│                 │  │ Channel title      │ │
│                 │  │ (centered)         │ │
│                 │  │ + subtitle (1 line)│ │
│                 │  └────────────────────┘ │
│                 │                         │
│                 │  ┌─ Category Tabs ────┐ │
│                 │  │ All | Image Play...│ │
│                 │  └────────────────────┘ │
│                 │                         │
│                 │  ┌─ Template Grid ────┐ │
│                 │  │ 3:4 cards with     │ │
│                 │  │ image + glass desc │ │
│                 │  │ (scrollable area)  │ │
│                 │  └────────────────────┘ │
│                 │                         │
│                 │  ┌─ Fixed Input Bar ──┐ │
│                 │  │ Prompt + controls  │ │
│                 │  │ (fixed bottom)     │ │
│                 │  └────────────────────┘ │
└──────────────────────────────────────────┘
```

## Detailed Changes

### 1. Hero Section (`HeroSection.tsx`)

- Center-align title and subtitle
- Add channel identity text: "Channel" badge or label above the main title
- Title: "Explore Creative Templates" (or similar channel-specific headline)
- Subtitle: single line, 16px, 70% opacity — e.g. "Browse curated AI video templates and start creating in one click."

### 2. Color System (`index.css`)

- Change `--primary` from `183 89% 69%` to `245 58% 65%` (violet-blue)
- Update `--accent`, `--ring`, `--sidebar-primary`, `--sidebar-ring` accordingly
- Update `.glass-btn` gradient colors from cyan `rgba(113,240,246,...)` to violet `rgba(124,107,219,...)`

### 3. Template Cards (`TemplateCard.tsx`)

- Change aspect ratio to 3:4
- Replace gradient backgrounds with uploaded images from the zip (copy to `src/assets/`)
- Remove tags display
- Add bottom frosted glass overlay (Aideo "Inspiration Labs" style):
  - Bottom gradient fade from transparent to black
  - Glass panel at bottom with `backdrop-filter: blur(16px)`, `rgba(255,255,255,0.08)` background
  - 3 lines of description text (14px, line-clamp-3)
  - Title above description
- "Try this" button appears on hover over the glass panel

### 4. Template Data (`templates.ts`)

- Remove `tags` field (or keep but don't display)
- Remove `gradient` field, add `image` field referencing uploaded assets
- Update descriptions to be more detailed (3 lines worth)

### 5. Category Filter (`CategoryFilter.tsx`)

- Change existing pill style to the reference video's style and update accent color to new violet-blue

### 6. Creation Panel / Input Bar (`CreationPanel.tsx`)

- **Fixed to bottom** of the viewport (not in scroll flow)
- Redesign to match Aideo Studio input box:
  - Rounded pill shape (`border-radius: 25px`)
  - Glass effect with `inset box-shadow` and `backdrop-filter: blur(12px)`
  - Prompt input area (contentEditable or textarea)
  - Bottom row: Model pill, Language pill, Duration pill, Ratio toggle, "Make" CTA button
  - All controls as compact pill-shaped dropdowns in a single row
- Narrower and more compact than current design

### 7. Page Layout (`Index.tsx`)

- Main content area needs `padding-bottom` to account for fixed input bar
- Remove `CreationPanel` from the scroll flow, render it as a fixed overlay at bottom
- Scrollable area contains: Hero → CategoryFilter → Template Grid

### 8. Asset Integration

- Extract images from uploaded `3比4的图片库.zip`
- Copy 10-12 images to `src/assets/` for template card thumbnails
- Import and assign to template data

## Files to Create/Modify


| File                                | Action                                                |
| ----------------------------------- | ----------------------------------------------------- |
| `src/index.css`                     | Update color variables, glass-btn colors              |
| `src/components/HeroSection.tsx`    | Center layout, channel identity, single-line subtitle |
| `src/components/TemplateCard.tsx`   | 3:4 ratio, image bg, glass overlay, no tags           |
| `src/components/CreationPanel.tsx`  | Fixed bottom bar, Aideo-style pill input              |
| `src/components/CategoryFilter.tsx` | Minor color updates                                   |
| `src/pages/Index.tsx`               | Layout restructure, fixed bottom input                |
| `src/data/templates.ts`             | Add image refs, update descriptions                   |
| `src/assets/template-*.jpg`         | Extracted from uploaded zip                           |
