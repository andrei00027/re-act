# Asset Generation Scripts

This folder contains HTML-based generators for app icons and splash screens.

## Usage

### 1. App Icon (1024x1024)

```bash
open scripts/generate-icon.html
```

- Click "Download Icon" button
- Save as `icon.png`
- Replace `assets/images/icon.png`

### 2. Splash Screen Icon (200x200)

```bash
open scripts/generate-splash.html
```

- Click "Download 200x200" button
- Save as `splash-icon.png`
- Replace `assets/images/splash-icon.png`

### 3. Android Adaptive Icons

```bash
open scripts/generate-android-icons.html
```

Download all three files:
- `android-icon-foreground.png` → `assets/images/`
- `android-icon-background.png` → `assets/images/`
- `android-icon-monochrome.png` → `assets/images/`

### 4. Favicon (optional)

For favicon, you can resize the main icon to 32x32 or 48x48:

```bash
# Using ImageMagick (if installed)
convert assets/images/icon.png -resize 48x48 assets/images/favicon.png
```

Or download the 200x200 splash icon and resize in any image editor.

## Design

**Concept:** Upward chevrons (momentum) with gradient (flow)

**Colors:**
- Primary: `#3949AB` (Indigo)
- Accent: `#26C6DA` (Turquoise)

**Symbol:** Double chevron pointing upward representing momentum and progress.
