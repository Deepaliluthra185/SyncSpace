---
name: SyncSpace Precision
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-lowest: '#020617'
  surface-low: '#0F172A'
  surface-mid: '#1E293B'
  border-subtle: rgba(255, 255, 255, 0.1)
  code-bg: '#1E1E1E'
  syntax-purple: '#C586C0'
  syntax-blue: '#9CDCFE'
  syntax-yellow: '#DCDCAA'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.7'
  caption:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-lg: 16px
  space-xl: 24px
  container-padding: 1rem
  gutter: 12px
---

## Brand & Style

The design system is engineered for **technical collaboration**, targeting a demographic of developers and designers who value density, precision, and performance. The brand personality is "Expert-Grade" — it is quiet, unobtrusive, and highly functional, allowing the user's work to take center stage.

The visual style is **Modern Corporate with a Technical Edge**, leaning into a "Studio" aesthetic. It utilizes a deep, monochromatic foundation punctuated by high-vibrancy accents. Key stylistic drivers include:
- **High Information Density:** Small, legible type and compact margins to maximize workspace.
- **Precision Detailing:** The use of hairline borders and strict grid alignment to evoke a sense of "engineered" quality.
- **Functional Depth:** Eschewing traditional shadows in favor of tonal layering and subtle surface shifts to define hierarchy.

## Colors

The color system is optimized for prolonged focus in a dark environment. The palette is anchored by **Deep Navy (#0F172A)**, which provides a sophisticated, low-strain background. 

- **Primary (Electric Blue):** Reserved for active states, primary actions, and branding. It represents the "energy" of real-time sync.
- **Secondary (Mint Green):** Strictly functional, used for "Live" indicators, success states, and positive terminal outputs.
- **Neutral Tiering:** Depth is created through three levels of slate: `surface-lowest` (the main canvas), `surface-low` (sidebar and panels), and `surface-mid` (hover states and active UI elements).
- **Syntax Palette:** A specialized set of high-contrast colors is used within code environments to ensure maximum readability against the `#1E1E1E` editor surface.

## Typography

This design system uses a dual-font approach to distinguish between navigation and data.

- **UI & Navigation:** Uses **Geist** for its clinical, neutral, and highly legible character. It is optimized for small-scale rendering on high-resolution screens. 
- **Code & Metadata:** Uses **JetBrains Mono**. This is used for code blocks, terminal output, and technical metadata (like Room IDs or timestamps) to provide a clear visual "break" from the standard UI.

**Scaling:** Typography remains relatively static across devices to preserve the tool-like density, but line heights are slightly increased on mobile for touch-target legibility.

## Layout & Spacing

The layout utilizes a **Technical Fixed Grid** for desktop and a **Fluid Stack** for mobile.

- **Desktop:** A multi-panel approach with a 12-column grid inside the main workspace. Sidebars are fixed at 240px or 320px depending on context.
- **Spacing Rhythm:** Based on a 4px baseline. Most UI gaps are `8px` (sm) or `12px` (md).
- **Margins:** Outer margins are kept at a strict `16px` to maintain a compact, "contained" software feel.
- **Responsive Behavior:** At the 768px breakpoint (Tablet), the sidebar collapses into a drawer. At 480px (Mobile), the dual-pane whiteboard/code view switches to a tabbed interface to preserve font legibility.

## Elevation & Depth

Hierarchy in this design system is established through **Tonal Layering and Hairline Borders** rather than shadows.

1.  **Level 0 (Canvas):** `#020617` — used for the deepest background layers (e.g., the area behind panels).
2.  **Level 1 (Surface):** `#0F172A` — the primary surface for panels, sidebars, and headers.
3.  **Level 2 (Active/Floating):** `#1E293B` — used for active tabs, hovered items, or popovers.

**Borders:** All panels and dividers use a `0.5px` solid border (`border-subtle`). This "hairline" aesthetic is critical to the system's high-tech feel.
**Active States:** Instead of elevation, active elements use the **Electric Blue** as a 2px left-border accent or a subtle background tint (`rgba(55,138,221,0.1)`).

## Shapes

The shape language is **Soft-Geometric**. We use controlled corner radii to soften the technical layout without making it appear "playful."

- **Standard UI (Buttons, Inputs):** `4px` (Soft).
- **Containers (Panels, Editor Blocks):** `8px`.
- **Primary Shell:** `12px` (used only for the main application viewport).
- **Avatars:** Always circular (50%) to contrast against the rigid rectangular grid of the workspace.

## Components

- **Buttons:** Primary buttons use a solid `Electric Blue` fill with white text. Secondary buttons use a ghost style with the `border-subtle` and `Geist` medium weight.
- **Input Fields:** Darker than the surface (`#020617`) with a `0.5px` border. The border glows `Electric Blue` on focus.
- **Chips/Status:** Compact (10px font) with a leading dot. Live indicators use a pulsing animation on the `Mint Green` dot.
- **Cards/Panels:** Defined by their background color (`surface-low`) and a `0.5px` border. Headers within cards should have a `label-sm` title and a bottom divider.
- **Code Editor:** Fixed-width font (`JetBrains Mono`), line numbers in `text-muted`, and a subtle `rgba(55,138,221,0.15)` highlight for the active line.
- **Avatars:** Small (`24px` or `32px`) with a `2px` border colored to match the user's specific cursor color in the collaborative space.