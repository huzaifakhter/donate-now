---
name: Lumina Altruism
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The brand personality is centered on **radical transparency, optimism, and reliability**. It aims to move away from the "guilt-tripping" aesthetics of traditional non-profits toward a modern, empowering experience that celebrates the act of giving. The target audience includes individual donors, corporate partners, and community organizers who value efficiency and clarity.

The design style is **Corporate Modern with a Minimalist touch**. It utilizes high-quality whitespace to reduce cognitive load and establish a sense of institutional stability. The interface should feel "airy" and professional, using subtle tonal shifts rather than heavy borders to define structure. The emotional goal is to evoke a sense of calm confidence and immediate agency.

## Colors

The palette is anchored by **Emerald Green**, chosen to symbolize growth and vitality, serving as the primary driver for "Donate" actions. A **Clear Blue** secondary color is used for informational elements and secondary navigation to reinforce the feeling of a trusted utility. 

The background is a very light "off-white" (`#FAFAFA`) to reduce screen glare and provide a subtle contrast against white (`#FFFFFF`) card elements. Grayscale tones are strictly cool-toned to maintain a clean, modern aesthetic. Semantic colors (Success, Warning, Error) follow standard conventions but are adjusted for high legibility against white backgrounds.

## Typography

This design system uses a dual-font approach. **Plus Jakarta Sans** is used for headlines to provide a friendly, slightly rounded, and approachable character. **Inter** is utilized for body text and labels to ensure maximum legibility and a systematic, clean feel.

To maintain accessibility, the minimum body size is 14px for secondary information and 16px for primary content. Headline weights are kept at Semi-Bold or Bold to create a clear visual hierarchy against the generous whitespace. Letter spacing is slightly tightened on larger display headings to maintain impact.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The system prioritizes "generous breathing room," meaning vertical gaps between sections are intentionally large (80px+) to prevent the interface from feeling cluttered.

Spacing follows an 8px base unit. Component internal padding should favor the larger side of the scale (e.g., 24px padding for cards) to support the airy aesthetic. Content is centered in a max-width container of 1280px to ensure readability on ultra-wide monitors.

## Elevation & Depth

This design system avoids heavy shadows and high-contrast borders. Instead, it uses **Soft Ambient Shadows** and **Tonal Layering**:

1.  **Level 0 (Background):** `#FAFAFA` - The canvas.
2.  **Level 1 (Cards/Surfaces):** `#FFFFFF` - Placed on the background with a very subtle, highly diffused shadow (Blur: 15px, Opacity: 4%, Y: 4).
3.  **Level 2 (Interactive/Floating):** `#FFFFFF` - For dropdowns and modals, with a more pronounced shadow (Blur: 30px, Opacity: 8%, Y: 10).

Separation is often achieved through subtle 1px borders using a light gray (`#E2E8F0`) rather than shadows to keep the UI looking "flat-plus" and crisp.

## Shapes

The shape language is consistently **Rounded**. A corner radius of `0.5rem` (8px) is the standard for cards and input fields, providing a soft, modern look that is more approachable than sharp corners but more professional than fully rounded "bubble" designs.

Buttons use a more pronounced `rounded-lg` or `rounded-full` (for specific CTAs) to make them feel "tactile" and inviting to click. Visual elements like progress bars for fundraising goals should always use fully rounded ends (pill-shaped) to represent fluidity and momentum.

## Components

### Buttons
- **Primary:** Solid Emerald Green with white text. 16px horizontal padding, 12px vertical. Semi-bold text.
- **Secondary:** Light Blue tint background with Blue text. No border.
- **Ghost:** Transparent background with Neutral-600 text; used for low-priority actions.

### Cards
Cards are the primary container for fundraiser items. They must have a white background, 8px radius, and the Level 1 shadow. Padding should be a minimum of 24px. Images within cards should have a top-only radius of 8px.

### Input Fields
Inputs use a light gray border (`#CBD5E1`) that transitions to Primary Emerald on focus. Label text is always positioned above the field in `label-md`.

### Progress Bars
Fundraising progress is displayed using a thick 8px height bar. The track is a light gray (`#F1F5F9`) and the indicator is a vibrant Primary Emerald gradient to Secondary Blue.

### Chips
Used for categories (e.g., "Education", "Emergency"). Small, `body-sm` font, with a light gray background and 16px radius for a pill-shaped appearance.