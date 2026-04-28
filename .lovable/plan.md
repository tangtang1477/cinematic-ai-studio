# Mobile Channel Page — Interactions & Player

All changes are mobile-only (`md:hidden` / `useIsMobile`). Desktop stays untouched.

## 1. Bottom nav icons → custom SVGs

Copy the 4 uploaded SVGs into `src/assets/nav/`:
- `home.svg`, `toolkit.svg`, `assets.svg`, `profile.svg`

In `MobileBottomNav.tsx`:
- Replace lucide `Home / Wrench / Library / User` with `<img src={icon} />` at 22×22.
- Inactive: `opacity:0.5`. Active: `opacity:1`. Center "Create" button unchanged.

## 2. Hide scrollbars (keep scroll behaviour)

In `MobileChannelPage.tsx`, on the category-chip strip and the grid scroll container, add a utility class `.no-scrollbar`:

```css
/* index.css */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

Touch / wheel scrolling continues to work.

## 3. Category filtering with selected state

- Map each card to a `category` field (cycle through `3D`, `Live-action`, `Image Play`, `Narrative`, `MV`, `Education`, `Commercial`, `2D`) so each chip surfaces a different subset.
- Filtered list: `gridImages.filter(c => c.category === activeCategory)`.
- Selected chip already styled (cyan pill + glow). Confirm contrast and add a subtle scale/opacity transition on tap.

## 4. Full-screen video player

Copy uploads to project:
- `user-uploads://19.gif → src/assets/clips/clip-19.gif`
- `20.gif`, `21.gif`, `22.gif` → `clip-20.gif`, `clip-21.gif`, `clip-22.gif`

Tapping any grid card opens a new component **`MobileVideoPlayer.tsx`** rendered as a `fixed inset-0 z-[60]` overlay:

Layout (mapped from the 750×1624 Figma to viewport units):
- Background: full-bleed `<img>` of the card's GIF, `object-cover`.
- Top-left **Back** button (40×40, `rgba(0,0,0,0.35)` + `backdrop-blur`, rounded-full) with a rotated arrow.
- Top-right **Sound off** button (same style) with a speaker-mute icon.
- Right rail at `bottom: ~22%`, vertical stack `gap: 28px`:
  - **Like** — heart outline → fills `#ef4444` when toggled, count below ("Like" label or number).
  - **Remix** — wand/sparkles glyph, label "Remix".
  - **Share** — paper-plane outline, label "Share".
- All labels: white, 13px, with subtle text-shadow.

Interactions:
- Back → close player.
- Like → toggle heart fill + colour, optimistic count++.
- Share → no-op (console log) for now.
- Remix → opens the Remix input drawer (below).

## 5. Remix input drawer (animated)

New component **`MobileRemixInput.tsx`** rendered inside the player when `remixOpen`:

- `fixed bottom-0 left-0 right-0` panel, height ~150px.
- `background: rgba(0,0,0,0.5)`, `border-top: 1px solid rgba(255,255,255,0.2)`, `backdrop-blur(7.5px)`, `border-radius: 24px 24px 0 0`.
- Slide-in animation: `translateY(100%) → 0`, 280ms `cubic-bezier(0.22,1,0.36,1)`. Slide-out on close.
- Backdrop: `rgba(0,0,0,0.4)` fade behind it; tap-to-dismiss.
- Contents:
  - Top row: textarea-like `<input>` placeholder "Describe changes…", white 50% colour.
  - Bottom row (left → right):
    - `+` button — 40×40 circle, `#151515`, border `#202020`.
    - Spacer (flex-1).
    - Settings gear button — same style.
    - Send button — 40×40 white circle, black up-arrow icon. Disabled (opacity 0.4) when input empty.
- Auto-focus the input when opened; `Esc` / backdrop tap closes.

## 6. State wiring

In `MobileChannelPage.tsx`:

```ts
const [playingCard, setPlayingCard] = useState<Card | null>(null);
// onClick of grid card → setPlayingCard(card)
// <MobileVideoPlayer card={playingCard} onClose={() => setPlayingCard(null)} />
```

Each card gets a `clip` field assigned round-robin from the 4 GIFs so every card plays one of the uploaded animations.

## Files

**New**
- `src/components/MobileVideoPlayer.tsx`
- `src/components/MobileRemixInput.tsx`
- `src/assets/nav/home.svg`, `toolkit.svg`, `assets.svg`, `profile.svg`
- `src/assets/clips/clip-19.gif`, `clip-20.gif`, `clip-21.gif`, `clip-22.gif`

**Edited**
- `src/components/MobileBottomNav.tsx` — swap to SVG icons
- `src/components/MobileChannelPage.tsx` — category filtering, hide scrollbars, open player
- `src/index.css` — `.no-scrollbar` utility

**Untouched**
- All desktop code paths (`Index.tsx` desktop branch, `HeroSection`, `CreationPanel`, `TemplateCard`, `FlyingCardsScene`, etc.)
