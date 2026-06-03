# Centricity NRI · Onboarding Builder (Figma plugin)

**Self-contained.** This plugin creates the design tokens (Figma Variables)
*and* draws the onboarding screens. No Tokens Studio. No CLI. No tokens.

## One-time setup (~90 seconds)

### 1. Install fonts
Install on your Figma org or local machine (all free, Google Fonts):
- **Caveat** (Regular, Bold)
- **Patrick Hand** (Regular)
- **JetBrains Mono** (Regular)

### 2. Import the plugin
1. Download these three files to a folder on your computer:
   - [`manifest.json`](./manifest.json)
   - [`code.js`](./code.js)
   - [`ui.html`](./ui.html)
   (or clone the repo, all three are in `design/figma-plugin/`)
2. In Figma, open OPUS-VERSION:
   https://www.figma.com/design/SZ95PmSFUty2V23TDRtdIm/OPUS-VERSION
3. Top menu → **Plugins → Development → Import plugin from manifest…**
4. Select the `manifest.json` you downloaded.
5. The plugin "Centricity NRI · Onboarding Builder" appears under
   **Plugins → Development**.

## Run

1. **Plugins → Development → Centricity NRI · Onboarding Builder**.
2. Click **"Setup variables"** (button 1).
   Wait ~3 seconds. Log shows:
   ```
   ✓ Collection "Core" — 87 variables created
   ✓ Collection "Semantic" — 24 variables created
   ✓ Variables ready.
   ```
3. Click **"Build S-01 · Splash"** (button 2).
   A 340×700 phone artboard appears in your viewport, every fill/stroke
   bound to a real Variable.

## Approve

Compare against `../screenshots/S-01.png`. Should match:
- Warm cream paper background
- Sketchy 3,3,0 ink shadow on the phone shell
- 64×64 logo square, radius 14, stroke 2
- "Centricity" in Patrick Hand 22
- "Wealth, for Indians abroad." in Patrick Hand 11.5
- "loading..." in JetBrains Mono 9.5 at 50% opacity

If it matches, tell me. I'll extend the plugin's button 3 to draw the
remaining 17 onboarding screens (S-02, S-03, O-01 through O-13).

## Troubleshooting

| Problem | Fix |
|---|---|
| "Found N existing variables. Skipping…" | Plugin won't create duplicates. To start fresh: open the Local variables panel (sidebar → "Local variables"), select all → ⋮ → Delete, then re-run Setup. |
| "Variable not found" | You skipped step 1 (Setup variables). Click that button first. |
| "Cannot load font: Patrick Hand" | Install the font in your Figma org or local OS. |
| Frame appears blank / off-screen | Press **`1`** in Figma to zoom-to-fit, or click the frame in the layer panel and **Shift+2** to center it. |
| Plugin crashes / hangs | Close the plugin window, re-open via Plugins menu. Variables you already created persist. |
