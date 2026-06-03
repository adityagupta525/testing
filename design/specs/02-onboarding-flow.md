# Onboarding Flow (Flow A) · Figma Build Spec

13 screens from Splash → Account Active. Each one is a Phone artboard
(340 × 700) inside a Figma **Section** titled `Flow A · Pre-Auth + Onboarding`.

> All values cite the token from `tokens/tokens.json` rather than the raw px/hex. Bind every layer to that token in the Variables panel.

Common scaffold for every screen unless noted:

```
Phone (component instance, 340×700)
├── notch  (component instance)
├── status-bar  (10:24 · ●●● 🔋 — text style `status`)
├── TopBar    (component instance — props in each screen)
├── Scroll    (Auto-Layout V, padding 12/14/80/14, gap 10, Fill)
│   └── ...content...
└── StickyCTA (component instance — variant per screen)
```

**Auto-Layout direction key:** V = vertical, H = horizontal. **Gap** values are between children. **Padding** is T/R/B/L.

---

## S-01 · Splash

- TopBar: **hidden** (no top bar on splash)
- Scroll content: Auto-Layout V, **place items: center**, padding 24, gap 16
  - Logo square 64×64, radius `xl` (14), stroke 2 `border.default`, label "C" — text style `display` size override 28
  - Text `h` size override 22 → "Centricity"
  - Text `help` → "Wealth, for Indians abroad."
  - Spacer 24
  - Text `meta` opacity 50% → "loading..."
- StickyCTA: **none**

## S-02 · Value Prop Carousel

- TopBar: hidden
- Scroll:
  - Image placeholder 200h, variant `ink` (diagonal hatching, dark) — label "DTAA / zero-tax illustration"
  - Eyebrow → "Slide 1 of 3"
  - `h` → "Invest. Pay zero tax. Legally."
  - `help` → "UAE & Singapore NRIs claim 0% capital-gains tax via India-DTAA treaty. We do the paperwork."
  - Carousel dots: Auto-Layout H, gap 6, center
    - Active dot 18×4 `background.inverse` radius 2
    - Inactive dots 6×4 `text.disabled` radius 2 (×2)
- StickyCTA (2-stack):
  - Button primary full → "Get started"
  - Button ghost full → "I already have an account"

## S-03 · Sign In

- TopBar: back=true, title "Sign in"
- Scroll:
  - Label "Mobile number"
  - Input value "+971 · 50 123 4567"
  - Help "We'll send a 6-digit OTP. Standard SMS rates apply."
  - Spacer 8
  - Button primary full → "Send OTP"
  - Centered chip (dashed) → "Use Face ID instead"

> **Error state to design** (variant on Input): empty number → input shows `feedback.error.border` + helper line "Enter a valid mobile number" in `feedback.error.fg`.

## O-01 · Mobile OTP

- TopBar: back, title "Verify mobile"
- Scroll:
  - Help → "Code sent to **+971 50 ••• 4567**"
  - OTP Input: filled=4 (cells 0-3 show digits, cells 4-5 empty)
  - Row spread: Meta "Resend in 0:42" · Chip dashed "Change number"
  - Box variant=info, dashed → Meta in `info.fg` "Auto-detected: UAE +971 number"
  - Button primary full marginTop 8 → "Verify & continue"

> **Error variant**: OTP cell turns `feedback.error.bg` with border `feedback.error.border`; below the OTP show helper text `feedback.error.fg` "Code incorrect — 2 attempts left".

## O-02 · Email OTP

- TopBar: back, title "Verify email"
- Scroll:
  - Label "Email" · Input "rahul.s@gmail.com"
  - Help "Code sent. Check inbox + spam."
  - OTP Input filled=6 (all filled)
  - Box variant=good, dashed → "✓ Email verified" (`good.ink`)
  - Button primary full → "Continue"

## O-03 · Country selection

- TopBar: back, title "Where do you live?"
- Scroll gap 10:
  - Help "Your tax residence — drives DTAA, FATCA, PFIC rules."
  - 6× Row, each: left = Label with flag + name, right = Chip
    - 🇦🇪 UAE → chip variant=`gold`, "DTAA · 0% gains"
    - 🇸🇬 Singapore → chip variant=`gold`, "DTAA · 0% gains"
    - 🇬🇧 United Kingdom → chip default, "DTAA · FTC available"
    - 🇺🇸 United States → chip variant=`warn`, "PFIC disclosure required"
    - 🇨🇦 Canada → chip variant=`warn`, "FAPI disclosure required"
    - Other → chip default, "Standard NRI flow"

## O-04 · PFIC Disclosure (US-only branch)

- TopBar: back, title "US tax notice"
- Scroll:
  - Chip variant=`warn` → "US NRI · mandatory"
  - `h` → "PFIC disclosure"
  - Help → "Indian mutual funds are classified as Passive Foreign Investment Companies under US tax law. This affects how you file Form 8621."
  - Box variant=`warn`:
    - Label `warn.fg` → "What you should know"
    - Meta `warn.fg` → "• Annual Form 8621 filing  • Mark-to-market or QEF election  • Consult a US tax advisor"
  - Box variant=default, dashed:
    - Label → "I understand and acknowledge"
    - Meta → "☑ Signed · Rahul S · 03 Jun 2026"
- StickyCTA (1): Button primary full → "Acknowledge & continue"

## O-05 · PAN Validation

- TopBar: back, title "PAN"
- Scroll:
  - Help → "Step 4 of 10 · Onboarding"
  - Progress value=40
  - Label → "Permanent Account Number"
  - Input value "ABCDE 1234 F"
  - Box variant=`info` → Meta `info.fg` "⟳ Verifying with NSDL…" (live state)
  - Box variant=`good` → Meta `good.fg` "✓ Match · Rahul Sharma · 12 Mar 1985" (resolved state)
  - Help → "We don't store your PAN image. Only the number, encrypted."
- StickyCTA (1): Button primary full → "Continue"

> **Three states to design as Figma variants on the PAN screen**:
> 1. **idle**: Box info hidden, Box good hidden
> 2. **verifying**: Box info shown, Box good hidden, primary CTA disabled (opacity 0.5)
> 3. **success**: Box info hidden, Box good shown, primary CTA enabled
> 4. **error**: Replace good with Box variant=`danger`, "✗ PAN not found in NSDL records" + helper "Check the PAN and try again"

## O-06a · CKYCR Fast-track

- TopBar: back, title "Confirm details"
- Scroll:
  - Box variant=`gold` → Label `gold.fg` "CKYCR record found ✓" + Meta `gold.fg` "You're KYC-compliant. Skipping document upload."
  - Help → "Confirm these details are still correct."
  - 4× Spread rows (k/v list) with dashed bottom border:
    - Name → Rahul Sharma
    - DOB → 12 Mar 1985
    - Address → Marina, Dubai, UAE
    - KYC date → 08 Aug 2023
  - Chip row: Chip dashed "Edit details" · Chip dashed "Looks correct"
- StickyCTA: Button primary full → "Confirm & continue"

## O-08 · Passport OCR (full-KYC branch)

- TopBar: back, title "Passport scan"
- Scroll:
  - Help → "Step 5 of 10 · Full KYC path"
  - Progress value=50
  - Wrapper (relative):
    - Image placeholder 200h, variant=`ink` → "camera viewfinder · passport bio page"
    - Inner viewfinder overlay: inset 14, dashed stroke 1.5 `paper.100`, radius `radius.md`, no fill
  - Chip row: Chip variant=`ink` "Front" · Chip dashed "Back"
  - Box dashed → Meta "Auto-read: Sharma, Rahul · M · IND · expires 14 Aug 2030"
- StickyCTA (2): Button default "Retake" + Button primary full "Looks good"

## O-08c · Video KYC scheduling

- TopBar: back, title "Video KYC"
- Scroll:
  - Help → "Live, agent-assisted. ~5 minutes. English / Hindi."
  - Box default:
    - Eyebrow → "Pick a slot · Today"
    - Chip row (wrap): 10:30 · 11:00 · 11:30 (variant=`ink`) · 12:00 · 14:00 · 14:30
  - Box default:
    - Eyebrow → "Tomorrow"
    - Chip row: 09:30 · 10:00 · 10:30 · 11:00
  - Box variant=`info`, dashed → Meta `info.fg` "Times shown in IST (Asia/Kolkata). Your timezone: Asia/Dubai · –2:30h."
- StickyCTA: Button primary full → "Confirm 11:30 IST"

## O-09 · Bank Link (NRE/NRO) — 3 states

### O-09a · form
- TopBar: back, title "Link bank account"
- Scroll:
  - Help → "Step 6 of 10"
  - Progress value=60
  - Label → "Account type"
  - Segmented 2-up: ["NRE (Repatriable)", "NRO (Non-Repat)"] · active = NRE
  - Help → "NRE — for foreign earnings, fully repatriable. NRO — for India income, capped repatriation (USD 1M/yr)."
  - Label "Bank" · Input "HDFC Bank" trailing="▾"
  - Label "Account number" · Input "•••• •••• 4521"
  - Label "IFSC" · Input "HDFC0001234"
  - Box variant=`info`, dashed → Meta `info.fg` "We'll send ₹1 to verify · refunded instantly"
- StickyCTA: Button primary full → "Verify account"

### O-09b · verifying
- TopBar: same
- Scroll content centered (grid place-items center, padding 24):
  - Circle 56×56, no fill, stroke 2.5 **dashed** `border.default` (Dash 5 / Gap 5) — the spinning ring
  - `h` → "Verifying..."
  - Help (center) → "Sending ₹1 to HDFC NRE ••••4521.\nUsually 10–30 seconds."
- StickyCTA: none

### O-09c · verified
- TopBar: same
- Scroll:
  - Box variant=`good`:
    - Label `good.fg` → "✓ HDFC NRE ••••4521 verified"
    - Meta `good.fg` → "Penny credit successful · marked as primary"
  - Box dashed:
    - Spread: Label "+ Add NRO account" · Meta "optional"
    - Help → "Useful for redemptions on India-sourced funds."
- StickyCTA: Button primary full → "Continue"

> **Error variant** for O-09: Box variant=`danger` "✗ Could not verify HDFC NRE ••••4521. Penny credit was not received." with a "Try again" Button below.

## O-10 · Risk Profile

- TopBar: back, title "Risk profile"
- Scroll:
  - Help → "Question 3 of 5"
  - Progress value=60
  - `h` → "If your portfolio dropped 20% in a month, you would…"
  - 4× Row (radio list). Selected row uses `selected=true` variant (stroke 2, bg `background.subtle`):
    - "Sell everything to cut losses" — unselected, circle avatar empty
    - "Sell some, hold the rest" — unselected
    - **"Hold and wait it out"** — selected, circle avatar with `●`
    - "Buy more at lower prices" — unselected
- StickyCTA: Button primary full → "Next"

## O-11 · Nominee

- TopBar: back, title "Add nominee"
- Scroll:
  - Help → "Optional, but recommended. You can edit anytime."
  - Label "Name" · Input "Priya Sharma"
  - 2-column grid (Auto-Layout H, equal fill, gap 8):
    - col 1: Label "Relationship" · Input "Spouse" trailing="▾"
    - col 2: Label "Share" · Input "100%" trailing="%"
  - Label "DOB" · Input "14 Jul 1988"
  - Box dashed: Spread row Label "+ Add another nominee" · Meta "must sum to 100%"
  - Chip row: Chip dashed "Set up later"
- StickyCTA: Button primary full → "Save & continue"

> **Error variant**: shares don't sum to 100% → show Box variant=`danger` "Shares must sum to 100% (currently 90%)" above the CTA.

## O-12 · Review + eSign

- TopBar: back, title "Review & eSign"
- Scroll:
  - Help → "Step 9 of 10 · Almost done"
  - Box variant=`soft`:
    - 6× Spread rows (k/v, dashed bottom):
      - Name → Rahul Sharma
      - Tax residency → UAE
      - PAN → ABCDE••••F
      - Bank → HDFC NRE ••••4521
      - Risk profile → Moderate
      - Nominee → Priya Sharma (100%)
  - Box dashed → Meta "SEBI brokerage disclosure · AMFI ARN-12345 · Tap to read full T&C"
  - Box variant=`info` → Meta `info.fg` "OTP-based eSign · Aadhaar-linked"
- StickyCTA: Button primary full → "eSign with OTP"

## O-13 · Account Active

- TopBar: hidden
- Scroll (justify-content: center, gap 0, padding 20/8):
  - Inner stack Auto-Layout V, center, gap 12:
    - Success ring: circle 72×72, fill `feedback.success.bg`, stroke 3 `feedback.success.fg`, glyph "✓" 32px `feedback.success.fg`
    - `h` → "Account Active!"
    - Help (center, 2 lines) → "Welcome to Centricity, Rahul.\nYour portfolio starts at ₹0."
    - Box variant=`gold`, marginTop 12, text-align left:
      - Label `gold.fg` → "Claim your 0% tax"
      - Meta `gold.fg` → "UAE has a DTAA treaty with India. You may save ~₹2.3L this FY."
      - Button gold size=sm marginTop 4 → "Activate DTAA →"
    - Button ghost full → "Maybe later, go to home"

---

## Frame layout in Figma canvas

Inside Section **`Flow A · Pre-Auth + Onboarding`**:

```
Row 1:  S-01 · S-02 · S-03 · O-01 · O-02 · O-03 · O-04
Row 2:  O-05 · O-06a · O-08 · O-08c · O-09a · O-09b · O-09c
Row 3:  O-10 · O-11 · O-12 · O-13
```

Gap between frames: **48px** (matches `DCSection gap` from HTML).
Caption under each frame (Auto-Layout V outside the phone, gap 2):
- `cap-id` text style → "O-05" (mono, 9.5, `text.tertiary`, tracking 8%)
- `cap-title` text → "PAN" (Patrick Hand, 15, 700)
- `cap-sub` text → "verify with NSDL · DigiLocker fallback" (Patrick Hand, 12, `text.secondary`)

Add **DCPostIt** annotations (Annotation component) next to screens that have non-obvious behavior. Examples:
- Next to O-01: "🚨 OTP locks after 5 failed attempts. Show timer."
- Next to O-04: "Only shown if country = 🇺🇸. Otherwise skip."
- Next to O-09b: "Ring rotates. ~30s timeout → show error path."
