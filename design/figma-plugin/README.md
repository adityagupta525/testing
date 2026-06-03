# Centricity NRI · Onboarding Builder (Figma plugin)

Reads variables imported by **Tokens Studio for Figma** and draws the
onboarding screens bound to them.

This is a **dev-mode plugin** — it lives in this repo, you load it
locally into Figma. No publishing, no review, runs immediately.

## Prerequisites

1. **Variables must already be in OPUS-VERSION**. Either:
   - Tokens Studio plugin (run it, load `../tokens/tokens.json`, click *Create Variables*), **or**
   - Run this plugin's *Check imported variables* button — it'll tell you what's missing.
2. **Fonts installed** in your Figma org: Caveat (Regular/Bold), Patrick Hand (Regular), JetBrains Mono (Regular/Medium/Bold). All free on Google Fonts.

## Step 1 — Import tokens via Tokens Studio (one-time, ~60 seconds)

1. Open OPUS-VERSION in Figma.
2. **Plugins → Find more plugins** → search **"Tokens Studio for Figma"** → Install (free).
3. Run it → **gear icon (top-right) → Load → "JSON file"**.
4. Pick `design/tokens/tokens.json` from this repo (download it locally first if you don't have it next to Figma).
5. In the Tokens Studio sidebar, enable all three sets: **core**, **semantic**, **components** (in that order).
6. At the bottom of the panel click **"Create Variables"**. After 5–10 seconds Tokens Studio reports how many variables, text styles, and effect styles it created.
7. Close Tokens Studio.

## Step 2 — Load this plugin (one-time)

1. In Figma → **Plugins → Development → Import plugin from manifest…**
2. Pick `design/figma-plugin/manifest.json` from this repo.
3. The plugin "Centricity NRI · Onboarding Builder" now appears under **Plugins → Development**.

## Step 3 — Run

1. Open OPUS-VERSION.
2. **Plugins → Development → Centricity NRI · Onboarding Builder**.
3. Click **"Check imported variables"** → confirm the six required ones are ✓.
4. Click **"Build S-01 · Splash"**.
5. After ~2 seconds, an S-01 phone artboard appears centered in your viewport.

## Step 4 — Approve the first cut

Compare the placed frame against `../screenshots/S-01.png`. They should match:
- Paper background, sketchy 3/3/0 ink shadow on the phone shell
- 64×64 logo square with radius 14, stroke 2
- "Centricity" in Patrick Hand 22
- "Wealth, for Indians abroad." in Patrick Hand 11.5
- "loading..." in JetBrains Mono 9.5 at 50% opacity
- 9.5px status bar in JetBrains Mono

If it matches, tell me. I'll extend the plugin to draw the remaining 17 onboarding frames (S-02, S-03, O-01 through O-13).

## Troubleshooting

- **"Variable not found"** → Tokens Studio import didn't run, or you skipped the *semantic* set. Re-run Tokens Studio and tick all three sets.
- **"Cannot load font"** → install the missing font in your Figma org (Files → Fonts) or your local system.
- **Frame appears off-screen** → it's placed at `viewport.center − (170, 350)`. Press `1` to zoom-to-fit or use the plugin's auto-scroll.

## What this plugin will eventually do

After approval of S-01, I'll add builders for the remaining 17 frames:
S-02, S-03, O-01, O-02, O-03, O-04, O-05, O-06a, O-08, O-08c,
O-09a, O-09b, O-09c, O-10, O-11, O-12, O-13.

Plus reusable component builders (TopBar, Box, Button, Input, OTP cell,
Chip, Row, Segmented, Progress, StickyCTA, TabBar) so each screen is
~30 lines of plugin code instead of ~200.
