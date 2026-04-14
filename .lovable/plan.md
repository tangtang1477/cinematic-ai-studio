# Channel Page Layout & Controls Redesign

## Changes

### 1. Layout: Fixed header + fixed footer, only cards scroll

Current: entire page scrolls including hero and filter.
Target: Hero + CategoryFilter fixed at top, CreationPanel fixed at bottom, only the template grid scrolls in between.

**Index.tsx** restructure:

- Wrap Hero + CategoryFilter in a fixed/sticky top container (below sidebar level)
- Template grid in a scrollable middle area with `overflow-y: auto` and padding for top/bottom fixed sections
- CreationPanel fixed at bottom, **full width** of content area (no max-width 800px constraint)

### 2. Hero: Remove "Channel" badge, move up

**HeroSection.tsx**:

- Remove the "Channel" pill badge entirely
- Reduce top padding (py-10 → py-4 or similar) to move title up
- Keep centered title + single-line subtitle

### 3. CreationPanel redesign

**Full-width**: Remove `maxWidth: 800` and centering transforms. Make it span the full width of the content area (minus sidebar).

**Controls row updates**:

- **Model selector**: "Seedance 2.0" as a dropdown button (using Popover or DropdownMenu). Clicking opens a dropdown with "Seedance 2.0" (selected) and "Happy Horse" (greyed/disabled)
- **Duration**: Change from pill buttons to a dropdown selector with the uploaded clock icon (`time.svg`). Options: 1 min/2 min/3 min/6 min/10 min, default "1 min"
- **Aspect ratio**: Replace text pills with icons — a landscape rectangle icon（monitor） and portrait rectangle icon（iPhone）, presented as a toggle/segmented control
- **Voiceover toggle**: Add back the voiceover on/off switch (was removed). Use a Switch component with label
- **Make button**: Keep existing glass-btn style

### 4. Template card glass overlay gradient fix

**TemplateCard.tsx**: The frosted glass overlay at the bottom currently has a hard edge. Add a gradient blur transition on the upper portion:

- Add a separate gradient overlay div above the glass panel that fades from transparent to the glass background
- Or use a `mask-image` gradient on the glass panel so the top edge fades smoothly

### 5. Asset: Copy time.svg icon

Copy the uploaded `time.svg` to `src/assets/icon-time.svg` for use in the duration dropdown.

## Files to Modify


| File                               | Changes                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `src/assets/icon-time.svg`         | New — copy from upload                                                                 |
| `src/pages/Index.tsx`              | Fixed top/bottom layout, scrollable middle                                             |
| `src/components/HeroSection.tsx`   | Remove Channel badge, reduce top padding                                               |
| `src/components/CreationPanel.tsx` | Full-width, model dropdown, duration dropdown with icon, ratio icons, voiceover switch |
| `src/components/TemplateCard.tsx`  | Gradient fade on glass overlay top edge                                                |
