# Centricity NRI Platform · HTML → Figma Design Kit

Deliverables for cloning `source-wireframes.html` into the Figma file
[OPUS-VERSION](https://www.figma.com/design/SZ95PmSFUty2V23TDRtdIm/OPUS-VERSION).

The source is an intentionally hand-drawn (Caveat / Patrick Hand / JetBrains Mono)
wireframe of an NRI mutual-fund app. Every primitive — colors, type,
spacing, radii, shadows, components, variants, error/success states — has
been extracted into design tokens and a build spec.

```
design/
├── source-wireframes.html         ← original HTML (frozen reference)
├── tokens/
│   └── tokens.json                ← Tokens Studio JSON · import into Figma
├── specs/
│   ├── 01-design-system.md        ← full token + component reference
│   └── 02-onboarding-flow.md      ← 18 onboarding screens, frame-by-frame
├── screenshots/
│   ├── S-01.png … O-13.png        ← rendered onboarding screens (@2x)
│   └── contact-sheet.png          ← overview of the whole flow
└── scripts/
    ├── render-onboarding.js       ← regenerate screenshots from HTML
    └── contact-sheet.js           ← regenerate overview
```

## Quick start

1. **Install the [Tokens Studio for Figma](https://tokens.studio/) plugin** in your Figma file (free).
2. Open OPUS-VERSION → Plugins → Tokens Studio → gear icon → **Load from file**, paste `tokens/tokens.json`.
3. Click **Create Variables** at the bottom. Tokens Studio will generate:
   - Three Variable collections (Core / Semantic / Components)
   - 16 text styles
   - 2 effect (shadow) styles
4. Install fonts org-wide: **Caveat**, **Patrick Hand**, **JetBrains Mono** (Google Fonts).
5. Open `specs/01-design-system.md` and build the 15 base components in order. Bind every layer fill/stroke/text to a token.
6. Open `specs/02-onboarding-flow.md` and assemble the 18 onboarding screens inside a Figma Section named `Flow A · Pre-Auth + Onboarding`. Cross-check against the matching PNG in `screenshots/`.

## Regenerating screenshots

```bash
npx playwright install chromium       # one-time
node design/scripts/render-onboarding.js
node design/scripts/contact-sheet.js
```

## What to approve in the first cut

Once you've built the **first onboarding screen** (`S-01 Splash`) in Figma using
the imported tokens + components:

1. Open the matching `screenshots/S-01.png` next to your Figma frame.
2. Confirm: paper color, sketch shadow on the phone shell, logo radius (14),
   Patrick Hand 22px headline, JetBrains Mono "loading…" eyebrow at 50% opacity.
3. If it matches, we proceed to the remaining 17 screens with the same pattern.
4. If anything's off, we adjust the token/component before going further —
   fixing the token once cascades to every screen automatically.
