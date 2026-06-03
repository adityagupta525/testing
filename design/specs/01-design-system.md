# NRI Platform · Design System Spec for Figma

This document maps every primitive in `source-wireframes.html` to its Figma
counterpart. Pair it with `tokens/tokens.json` (Tokens Studio JSON, importable
into Figma Variables via the free Tokens Studio plugin).

> The wireframes are intentionally **hand-drawn / sketchy**. Fidelity rules:
> - Strokes use decimal widths (1.2 / 1.3 / 1.4 / 1.5 / 2 / 2.5 / 3 px). Figma supports decimals — do not round.
> - The phone shell uses an **offset solid shadow** (`3,3,0` ink color), not a soft blur. Recreate as a Drop Shadow effect with blur 0.
> - Type pairing is deliberate: hand fonts for narrative/UI labels, JetBrains Mono for numerics, status, eyebrows.

---

## 1. Loading tokens into Figma

1. In your Figma file `OPUS-VERSION`, open **Plugins → Tokens Studio for Figma**.
2. Tokens Studio panel → **Tools (gear) → Load from file/folder or paste JSON**.
3. Paste `tokens/tokens.json`. You will see three sets: `core`, `semantic`, `components`.
4. **Apply token sets**: enable all three (Source order: core → semantic → components).
5. Click **Create Variables** at the bottom. Tokens Studio will create:
   - Figma **Variables** (Collections: Core, Semantic, Components) for color, number, string tokens.
   - **Text styles** from each `components.text-style.*` entry.
   - **Effect styles** for shadows.
6. Re-bind: open the Variables panel and confirm each token shows in **Local Variables**.

> Tokens Studio creates aliasing automatically — semantic tokens reference core, components reference semantic. Edit a core color once, and everything downstream updates.

---

## 2. Color system

### 2.1 Core palette (primitives — never use directly on a layer; reference via semantic)

| Token | Hex | Used for |
|---|---|---|
| `core.color.paper.100` | `#FAF7F1` | Default surface (phone screen, cards, inputs) |
| `core.color.paper.200` | `#F2EEE3` | Subtle surface (tab bar, toggle bg, hatch) |
| `core.color.paper.300` | `#ECE7DA` | Filled box variant |
| `core.color.paper.canvas` | `#E9E4D6` | Page canvas |
| `core.color.paper.canvas-grid` | `#F0EEE9` | Figma-canvas surface |
| `core.color.ink.100` | `#1F2024` | Primary text |
| `core.color.ink.200` | `#3D3F46` | Secondary text |
| `core.color.ink.300` | `#6B6E78` | Tertiary text / hairlines |
| `core.color.ink.400` | `#B0B2BA` | Disabled / faint |
| `core.color.ink.line` | `#2A2C32` | Default stroke + inverse fill |
| `core.color.ink.line-soft` | `#9A9CA4` | Soft stroke |
| `core.color.gold.*` | `#F4D58A / #B8911C / #7A5A1E` | **DTAA** accent (the brand's hero color) |
| `core.color.warn.*` | `#F4B27F / #B86614 / #7B3F12` | Warnings (US PFIC, expiring TRC, missed SIP) |
| `core.color.danger.*` | `#EFA9A0 / #962A1E / #7A1F15` | Errors, expired states |
| `core.color.good.*` | `#B9DDB7 / #3F7A3B / #2C5A2A` | Success, verified |
| `core.color.info.*` | `#B9D2E4 / #2D6188 / #1F4663` | Info / passive callout |
| `core.color.note.*` | `#FFE9A8 / #C9A93E / #4B3A00` | Sticky-note annotation |

### 2.2 Semantic palette (bind components to these)

- `semantic.background.{canvas|surface|subtle|filled|inverse}`
- `semantic.text.{primary|secondary|tertiary|disabled|on-inverse}`
- `semantic.border.{default|soft|hairline|faint}`
- `semantic.feedback.{success|warning|error|info}.{bg|border|fg}`
- `semantic.accent.{gold|note}.{bg|border|fg}`

> Rule of thumb: every layer fill or stroke must bind to a `semantic.*` token. The `core.*` palette is for the system, not for layers.

---

## 3. Typography

Three font families do all the work:

| Family | Weights | Role |
|---|---|---|
| **Caveat** | 500, 700 | Display headlines (section titles, hero) — the "marker" feel |
| **Patrick Hand** | 400, 700 | Body, labels, buttons, chips — the "handwritten" UI voice |
| **JetBrains Mono** | 400, 500, 700 | Numerics, status bar, eyebrows, meta — the "spec" voice |

> Install all three in your Figma org before importing tokens. Tokens Studio will create text styles but cannot install fonts.

### 3.1 Text styles (created by Tokens Studio from `components.text-style.*`)

| Style | Family | Size | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display` | Caveat | 28 | 700 | 0 | DCSection headlines |
| `h` | Patrick Hand | 18 | 700 | 0 | Screen headlines |
| `h2` | Patrick Hand | 15 | 700 | 0 | Section headlines, captions |
| `topbar-title` | Patrick Hand | 16 | 700 | 0 | Top bar |
| `label` | Patrick Hand | 13 | 600 | 0 | Field labels, row primary text |
| `help` | Patrick Hand | 11.5 | 400 | 0 | Helper text, descriptions |
| `btn` | Patrick Hand | 14 | 700 | 0 | Buttons |
| `btn-sm` | Patrick Hand | 12 | 700 | 0 | Small buttons |
| `chip` | Patrick Hand | 11 | 400 | 0 | Chips |
| `tab-label` | Patrick Hand | 10 | 400 | 0 | Tab bar |
| `eyebrow` | JetBrains Mono | 8.5 | 600 | 14% | UPPERCASE Eyebrows |
| `meta` | JetBrains Mono | 9.5 | 400 | 0 | Helper meta, NAV cut-offs |
| `status` | JetBrains Mono | 9 | 400 | 0 | Phone status bar, tz clocks |
| `num-l` | JetBrains Mono | 20 | 600 | −2% | Large numerics |
| `num-xl` | JetBrains Mono | 26 | 600 | −2% | Hero portfolio value |
| `anno` | Patrick Hand | 11 | 400 | 0 | Sticky-note annotation |

---

## 4. Spacing & sizing

Spacing scale (use in Auto-Layout gap/padding): **2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30**

| Size token | Px | Notes |
|---|---|---|
| `phone-w` / `phone-h` | 340 / 700 | Artboard / device frame |
| `screen-h` | 670 | Phone minus 30px status area |
| `tabbar-h` | 60 | Bottom nav |
| `input-h` | 40 | Default input height |
| `input-lg-h` | 60 | OTP big input |
| `btn-h` / `btn-sm-h` | 44 / 32 | WCAG primary / compact |
| `row-min-h` | 44 | List rows (WCAG tap target) |
| `otp-cell-h` | 36 | Single OTP cell |
| `avatar` | 26 | Avatar square |
| `tab-icon` | 22 | Bottom tab icon |
| `tab-icon-invest` | 38 | Center FAB-style invest icon (raised) |

---

## 5. Radii

| Token | Px | Used on |
|---|---|---|
| `radius.xs` | 4 | TZ pill, tabbar icon |
| `radius.sm` | 6 | Avatar, OTP cell, sticky note, mini-img |
| `radius.md` | 8 | Inputs, rows, segmented, btn-sm, generic |
| `radius.lg` | 10 | Boxes, buttons (default), CTA panel |
| `radius.xl` | 14 | Splash logo |
| `radius.phone` | 30 | Phone outer shell |
| `radius.pill` | 999 | Chips, toggle, progress |

---

## 6. Strokes

Decimal stroke widths are **load-bearing** to the sketchy look. Do not round.

| Token | Width | Where |
|---|---|---|
| `stroke.hairline` | 1.2 px | TZ chip, progress border |
| `stroke.thin` | 1.3 px | Avatar, chips |
| `stroke.soft` | 1.4 px | Annotation, tab icon |
| `stroke.default` | 1.5 px | Default box / input / button / row / segmented |
| `stroke.bold` | 2 px | Phone shell, selected row |
| `stroke.heavy` | 2.5 px | Verifying / loading rings |
| `stroke.extra` | 3 px | Success ring on Account Active |

> In Figma, set Stroke → click the stroke weight number and type `1.5` (etc.). Hold ⌥ to confirm decimal precision in inspector.

### 6.1 Dashed strokes
Used on: dashed boxes (placeholder/optional), dashed chips ("Use Face ID instead", "Looks correct"), dashed dividers, loading rings, KYC viewfinder.

In Figma: Stroke panel → **Dash** = 4–6, **Gap** = 4–6. The HTML uses CSS `border-style: dashed`, which renders ~4px/4px in most browsers. Use **Dash 5, Gap 5** as your default for parity.

---

## 7. Shadows

| Token | Spec | Where |
|---|---|---|
| `shadow.sketch` | `3 3 0 0 #2A2C32` (no blur, no spread) | Phone shell — gives the "off-paper" hand-cut look |
| `shadow.note` | `2 2 0 0 rgba(0,0,0,0.10)` | Sticky-note annotations |

In Figma → Effects → **Drop shadow** → set X/Y/Blur/Spread literally (blur = 0). This is critical — a soft blur will lose the sketchy aesthetic.

---

## 8. Components — variant matrix

Build each component as a **Figma Component** with variants. Bind every fill/stroke/text to a token. Wrap in Auto-Layout.

### 8.1 `Phone` (frame component)
- Properties: `tab` (none / home / portfolio / invest / tax / profile / hideTabBar=true), `hideTabBar` (bool)
- Size: 340 × 700, radius 30, stroke 2 / `border.default`, fill `background.surface`, effect `shadow.sketch`
- Children: `notch` (90×14, top 8, radius `radius.md`, fill `background.inverse`), `status-bar` (Auto-Layout horizontal, padding 0/18, height ~14, time + battery), `screen` (Auto-Layout vertical, inset top 30, flex), optional `tabbar` (absolute bottom).

### 8.2 `TopBar`
- Auto-Layout horizontal, space-between, padding 14/16/10/16, border-bottom 1.5 `border.hairline`, fill `background.surface`
- Slots: `back` (optional), `title` (text style `topbar-title`), `right` (optional — clocks, avatar, action)
- Variants: `back=true/false`, `dualClock=true/false`, `right=none/clocks/avatar/text`

### 8.3 `Box`
- Auto-Layout vertical, padding 10/12, gap 6, radius `radius.lg`, stroke 1.5, fill `background.surface`
- Variants: `variant` = default / soft / filled / ink / gold / warn / danger / good / info
- Sub-variant: `style` = solid / dashed
- Bind: each variant updates `bg`, `border`, `fg` to matching `box.{variant}` tokens

### 8.4 `Button`
- Auto-Layout horizontal, center/center, height 44, paddingX 16, gap 6, radius `radius.lg`, stroke 1.5
- Variants:
  - `variant`: default / primary / gold / ghost
  - `size`: md (44) / sm (32, radius `radius.md`, padding 12, text `btn-sm`)
  - `full`: true / false (Resizing → Fill container when true)
  - `state`: default / disabled (opacity 0.5)
- Slots: leading icon, label, trailing icon

### 8.5 `Input`
- Auto-Layout horizontal, space-between, height 40, paddingX 12, radius `radius.md`, stroke 1.5
- Variants:
  - `state`: default / focus (stroke `border.default` + 0.5px halo) / **error** (bg `feedback.error.bg`, border `feedback.error.border`, fg `feedback.error.fg`) / disabled (opacity 0.5)
  - `size`: md (40) / lg (60, text `num-xl`, center-aligned, mono)
  - `trailing`: none / icon / unit (`%`, `▾`)
- Slots: label (external), value text, trailing

### 8.6 `OTP Input`
- 6 cells, Auto-Layout horizontal, gap 6
- Cell: 36×36, radius `radius.sm`, stroke 1.5, text style derived from `num-xl` but size 16
- Cell variants: `state` = empty (fg `text.disabled`) / filled (fg `text.primary`) / focused (stroke 2 `border.default`) / error (border + bg from `feedback.error`)

### 8.7 `Chip`
- Auto-Layout horizontal, padding 4/10, radius `radius.pill`, stroke 1.3
- Variants: `variant` = default / gold / good / warn / danger / ink / **dashed**
- Combine with `size` = sm (text 11) / xs (text 10)

### 8.8 `Row` (list item)
- Auto-Layout horizontal, space-between, padding 9/10, gap 8, min-height 44, radius `radius.md`, stroke 1.5
- Children: `left` (avatar + label/sub stack), `right` (value/sub stack or chip)
- Variants: `selected` = false / **true** (stroke 2, bg `background.subtle`)
- Avatar variants: `square` (radius `radius.sm`) / `circle` (radius `radius.pill`)

### 8.9 `Segmented`
- Auto-Layout horizontal, equal-fill items, height ~30, radius `radius.md`, stroke 1.5, internal divider 1.5
- Item variants: default / **active** (bg `background.inverse`, fg `text.on-inverse`, bold)
- Common counts: 2, 3, 4, 5, 6 segments

### 8.10 `Toggle` (pill segmented, lightweight)
- Auto-Layout horizontal, radius `radius.pill`, padding 0, bg `background.subtle`, stroke 1.5
- Items 5/10 padding; active item dark fill `background.inverse`

### 8.11 `Progress`
- Track: height 6, radius `radius.pill`, bg `background.subtle`, stroke 1.2 `border.hairline`
- Fill: height 6, bg `background.inverse`, width-bound by `value` property (0–100)

### 8.12 `StickyCTA` (bottom-anchored container)
- Absolute, bottom 0, left/right 0, padding 10/14/20/14, border-top 1.5 `border.hairline`, fill `background.surface`, gap 8
- Variants: 1 button / 2 buttons (first non-full, second full)

### 8.13 `TabBar`
- 60h, 5 equal columns, border-top 1.5, bg `background.subtle`
- Item variants: default / active (bold, ink)
- Special: middle "invest" item raised −16 with circular ink fab 38×38

### 8.14 `Annotation` (sticky note)
- Auto-Layout vertical, padding 6/8, radius `radius.sm`, stroke 1.4
- Effect: `shadow.note`
- Optional `pin` decoration: 14×14 circle, fill `note.pin`, stroke 1.5 `note.pin-border`, position top-left −6/−6
- Max width 240; text style `anno`

### 8.15 Misc
- **Eyebrow** text label (use text style `eyebrow`, color `text.tertiary`)
- **Donut** (SVG-based) — build as a component with `segments` (array property as instance swap of pre-built ring images, or as a constrained vector)
- **Spark** (sparkline) — placeholder rectangle 290×56 with stroke 1.5; replace with real chart in final
- **Risk-o-meter** — 5-step gauge component, variant `level` 1–5

---

## 9. Error & feedback states (system-wide)

Every input/button/row supports these states. Wire them up via Variants.

| State | How it looks | Tokens |
|---|---|---|
| Default | Surface bg + ink border | `box.default` |
| Hover (web) | bg `paper.200` | `box.soft` |
| Focus | stroke 2px `border.default` + 1px outer offset | `border.default` |
| Disabled | opacity 0.5 | — |
| **Error** | bg `danger.fill`, border `danger.border`, text `danger.ink`, optional helper text in `danger.ink` below | `feedback.error.*` |
| Verifying | bg `info.fill`, border `info.border`, dashed loading ring (2.5 stroke) | `feedback.info.*` |
| Success | bg `good.fill`, border `good.border`, ✓ glyph | `feedback.success.*` |
| Warning | bg `warn.fill`, border `warn.border` | `feedback.warning.*` |

> Build a `Feedback Banner` component once with `variant` = info / good / warn / danger. Reuse everywhere.

---

## 10. Layer naming convention (so the Figma file stays clean)

```
[Screen] O-05 PAN
  ├── Phone
  │   ├── Status Bar
  │   ├── TopBar (back=true, title="PAN")
  │   ├── Scroll
  │   │   ├── Help "Step 4 of 10 · Onboarding"
  │   │   ├── Progress 40
  │   │   ├── Label "Permanent Account Number"
  │   │   ├── Input value="ABCDE 1234 F"
  │   │   ├── Box (variant=info)  "⟳ Verifying with NSDL…"
  │   │   ├── Box (variant=good)  "✓ Match · Rahul Sharma..."
  │   │   └── Help "We don't store your PAN..."
  │   └── StickyCTA
  │       └── Button (primary, full) "Continue"
```

Prefix screens with their flow ID (`S-01`, `O-01`, `H-01a`, `P-01`, `I-01`, `B-01`, `C-01`, `D-01`, `E-01`, `F-01`, `Pr-01`). Group flows as Figma **Sections** (Shift-A) so the canvas mirrors the HTML's `DCSection` structure.
