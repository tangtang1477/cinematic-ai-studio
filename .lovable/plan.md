# MovieFlow.ai — AI Video Generation Channel Page

## Overview

Build a stunning, high-fidelity channel page for movieflow.ai featuring Apple-inspired glassmorphism, premium aesthetics, and full interactivity for browsing and applying AI video templates.

## Design System

- **Palette**: Soft neutral background (#f8f9fc), frosted glass panels with white/blue-tinted transparency, accent color in cool violet-blue (#6366f1)
- **Typography**: Clean sans-serif (Inter/system), strong hierarchy with large hero text, medium card titles, small labels
- **Glass effects**: backdrop-blur, semi-transparent whites, subtle borders (white/10%), soft box-shadows
- **Radius**: Large rounded corners (16-24px), pill buttons
- **Spacing**: Generous whitespace, 8px grid system

## Sections to Build

### 1. Hero Section

- Large cinematic headline: "Create Cinematic AI Videos in Minutes"
- Subtitle with premium tone about AI-powered video generation
- Subtle gradient mesh background with soft animated feel

### 2. Category Filter Bar

- Horizontal row of pill/chip buttons for categories (All, Image Play, Narrative, Music Video, Education, Commercial, 2D.3D.)
- Clear default/hover/active/selected states with glass styling
- Smooth transitions between states

### 3. Template Card Grid

- Responsive grid of template cards (3-4 columns)
- Each card: gradient placeholder thumbnail, title, description, style tags, "Try this" button
- Hover state: card lifts with shadow, "Try this" button appears/becomes prominent
- Click "Try this" → template prompt auto-fills into the creation panel input box
- ~8-12 sample templates with realistic AI video generation prompts

### 4. Creation Panel (sticky/prominent)

- Large frosted-glass panel with prompt textarea (pre-fillable via "Try this")
- Controls in a clean row/grid:
  - **Model**: Dropdown — "Seedance 2.0" (default), "Happy Horse" (disabled/greyed)
  - **Language**: Dropdown — English default
  - **Duration**: Segmented control — 1/2/3/6/10 min
  - **Aspect Ratio**: Toggle — Portrait / Landscape
  - **Voiceover**: Toggle switch — On/Off
- "Generate Video" CTA button with accent color
- All controls styled with glass aesthetic, proper disabled states

### 5. Interactions & State Management

- React state for: selected category filter, active template prompt, all creation settings
- Clicking "Try this" scrolls to creation panel and fills prompt
- Smooth scroll behavior, hover animations, transitions

## Technical Approach

- Single `Index.tsx` page with extracted components
- Tailwind CSS for all styling including custom glass utilities
- Framer Motion or CSS transitions for hover/scroll effects
- Mock data for templates
- Fully responsive desktop-first layout