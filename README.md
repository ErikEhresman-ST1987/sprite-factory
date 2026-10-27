# Sprite Factory

A browser-based graphics preparation workshop for game assets, developed primarily for **Little Field Farm** and tested in iPad Safari. Import PNG, JPG, or WebP artwork; inspect a preview; export verified WebP assets. This README documents the production state through **Increment 11F (accepted and merged, October 2026)**.

## Game Graphics Workshop — current development branch

The original Sprite Factory is now joined by three independently accessible tools in the **Game Graphics Workshop**:

- **[Workshop Home](workshop/index.html)** — entry point for all four tools.
- **[Scene Editor](workshop/scene-editor/index.html)** — background and sprite composition, sprite touch zones, invisible background hotspots, editable scene projects, and game placement JSON.
- **[Animation Studio](workshop/animation-studio/index.html)** — individual-frame alignment, preview, editable projects, and separately downloadable WebP strips and matching JSON metadata.
- **[Engine Verification](workshop/engine-verification/index.html)** — isolated PixiJS v8 / Phaser 3 checks using actual Workshop exports.

See **[Workshop Workflow](workshop/WORKFLOW.md)** for exact steps, file types, revision procedure, and troubleshooting; **[Export Contract](workshop/EXPORT-CONTRACT-v1.md)** for formats; and **[4B Regression Checklist](workshop/RELIABILITY-REGRESSION-4B.md)** for repeatable tests.

**Acceptance:** Increments 4A, 4A.1, and 4B passed user testing on iPad Safari. This does **not** mean the Workshop is merged into `main` or that Little Field Farm already imports its exports. The working recovery branch is `backup/workshop-4a1-accepted-20261026`.

The detailed Sprite Factory instructions below remain applicable to the original processing tool.

---

## Purpose and scope

Sprite Factory prepares finished illustrations for use in games. It does not generate artwork, paint new details, or author arbitrary multi-row animation atlases. Its three processing modes are **Sprite**, **Background**, and **Sprite Sheet**. The interface is designed for a simple import → configure → preview → download workflow. Source images are processed in the browser.

## Usage

1. Open the GitHub Pages deployment in Safari or another modern browser.
2. Choose **Graphic type** and upload a PNG, JPEG, or WebP image.
3. Select the relevant settings below.
4. Click **Create WebP**; inspect the checkerboard preview (transparent modes) or full-frame scenery.
5. For a sprite sheet, use **Play** and the **1–12 FPS** slider to inspect motion. The animation preview does not alter the exported file.
6. Click **Download WebP** after successful verification. Import the exported asset into the game.

### Sprite — individual objects and characters

Designed primarily for illustrations on white backgrounds. The **White background removal** tolerance defaults to 35 (range 0–90). Edge-connected background removal keeps enclosed white details by default; the optional **Remove white areas inside artwork** setting can also erase legitimate white details. **Soften pale edges** reduces light halos. **Center and size the subject automatically**, plus **Subject size**, control framing. Output presets: 64, 128, 256, 512, 1024 pixels square, or custom width/height up to 4096; **Keep original proportions** is available.

Inspect pale details, shadows, and thin edges carefully. White-background extraction is not a substitute for a hand-authored alpha mask.

### Background — full-screen scenery

Fills the requested screen dimensions without distortion, cropping overflow evenly. **White skies and clouds are preserved** rather than made transparent. Presets: **1280 × 720 (16:9)**, **1920 × 1080 (16:9)**, **1024 × 768 (4:3)**, or custom dimensions up to 4096. Use for complete scene backgrounds, not isolated sprites.

### Sprite Sheet — one horizontal row of animation poses

Input: a single image containing **2–16 poses in a horizontal row**. Output: **one horizontal transparent WebP strip** with equal square cells of **128, 256, or 512 pixels**. The total output width must not exceed **4096 pixels**. Example: six 256-pixel frames produce a 1536 × 256 WebP. Sprite Factory does not produce separate frame files in this mode.

**Frame alignment:**
- **Stationary:** attempts to hold the character steady for idle, pecking, grazing, and similar animations.
- **Moving:** retains source-based horizontal motion for the original Equal-width/Smart extraction approaches; for Individual characters, the component is centered within its cell. Review motion before use.

**Extraction method:**
- **Equal-width (original, default):** slices the source into equally wide vertical regions. Recommended when each pose is regularly spaced and fully contained within its region. This is the established chicken workflow.
- **Smart boundaries (experimental):** searches near expected vertical cuts for clear gaps; refuses export if a safe cut cannot be found. Useful when spacing is uneven but clean vertical gaps exist.
- **Individual characters (experimental):** identifies connected dark/colored foreground regions against a light background, extracts each subject with a pixel mask rather than a rectangular copy, sorts them left to right, and refuses export if the detected count differs from the requested frame count. Useful when characters' horizontal extents overlap and equal-width slicing would cut off ears, tails, or heads. Small disconnected elements, very light details, touching subjects, and complicated backgrounds can cause errors or missing pixels. This is not a general-purpose segmentation model.

**Diagnostics:**
- **Analyze source boundaries:** overlays expected equal-width cut lines and flags intersections with visible artwork; it does not change processing.
- **Detect individual characters:** outlines connected foreground regions and reports the detected count; it does not itself change processing. Choose the Individual characters extraction method separately to use those regions in export.

**Alignment implementation note (Increment 11E–11F):** In **Individual characters + Stationary**, frames retain their original source-image vertical offsets and their relative horizontal positions within nominal source-cell slots, using a shared translation and common scale. This avoids reanchoring a grazing cow to its lowered muzzle or independently recentering its changing silhouette. The other extraction modes retain their prior alignment behavior. Source artwork still matters: imperfect pose-to-pose positioning can leave a little lateral movement.

**Suggested verified settings:**
- Chicken idle: **Equal-width**, **Stationary**, four frames (use the same output cell size as the previously tested chicken asset).
- Cow grazing: **Individual characters**, **Stationary**, **6 frames**, **256 × 256 cells**, preview at **4 FPS**.

If extraction refuses export, check the reported count, source diagnostic, and frame count. Do not assume that selecting a larger cell repairs a badly separated or touching source image.

## Export verification and practical constraints

- Exports are WebP, not renamed PNGs. The app verifies the **RIFF/WEBP** signature and checks decoded dimensions; sprite-sheet export additionally checks that every cell contains visible pixels and transparency.
- WebP encoding uses the browser when supported, with a WebAssembly fallback loaded from an external service when needed. **Internet access may be required for fallback encoding**; do not assume offline operation.
- The animation preview reads the processed strip. Inspect the exported result in the target game as well.
- Browser processing, memory, and image complexity impose practical limits. Individual-character detection has a **10-million-pixel source-image limit**.
- No account, cloud upload workflow, sprite-sheet metadata/JSON atlas, automated animation quality judgment, or general batch processing is provided.

## Increment history and acceptance evidence

| Increment | Change | Outcome |
| --- | --- | --- |
| Initial feasibility | White-background transparent sprite processing and WebP verification | Foundation for later modes |
| Through 10 | Sprite and full-screen Background modes; horizontal Sprite Sheet mode, transparency verification, animation preview, stationary/moving alignment | Four-frame chicken idle exported and independently played successfully |
| 11A | Diagnostic for equal-width source boundaries | Revealed unsafe cuts on six-cow source |
| 11B | Experimental Smart boundaries | Correctly refused unsafe cow cuts instead of silently clipping |
| 11C | Connected-component character diagnostic | Detected all six cows as separate regions |
| 11D | Individual-character masked extraction | Cow intact, grazing natural; vertical bouncing remained |
| 11E | Shared source-based vertical positioning | Greatly reduced bouncing caused by lowered head |
| 11F | Shared source-based horizontal positioning | Remaining slight horizontal motion judged smooth and acceptable |
| Regression | Original chicken with original Equal-width settings | User confirmed animation remains perfect |

**Acceptance:** User approved Increment 11 for production after testing cow extraction and the original chicken regression. Changes were merged into `main` via [pull request #2](https://github.com/ErikEhresman-ST1987/sprite-factory/pull/2). The slight cow side-to-side motion is a **known accepted limitation**, not a claim of perfectly fixed foot anchoring.

## Architecture and development handoff

- Static client-side app: `index.html` (controls and markup), `style.css` (layout and presentation), `app.js` (mode switching, image processing, WebP export/verification, animation and diagnostics).
- No build step is required for the present source layout. GitHub Pages serves the static files.
- Main entry points in `app.js`: `createBackground()`, `createSheet()`, `drawAnimationFrame()`, `findSmartCuts()`, and `extractConnectedSubjects()`. The Sprite mode is handled by the main Process button handler.
- In Sprite Sheet processing, preserve **Equal-width** as the default and do not silently change its chicken-tested alignment. The **Individual characters** branch is intentionally separate, with component-specific shared-coordinate alignment.
- The component detector uses an 8-connected foreground mask with a light-background color threshold and a minimum region-size filter; extraction expands a narrow fringe around component pixels and computes alpha against near-white pixels. It can lose very pale markings or detached small details. Do not describe it as infallible.
- The output sheet uses a shared scale and explicit bounds checks. Export failures should remain visible errors, not cropped or misleading successes.
- When editing `app.js` or `style.css`, update the corresponding cache-busting query in `index.html` to reduce Safari stale-file problems.
- **Development process:** create a separate branch from `main`; make a small approved increment; test in iPad Safari with the cow and chicken regression cases; merge only after user acceptance. Preserve known-good production behavior. Use the project's governing development and graphical-asset principles alongside this README.

## Deployment reminder

GitHub Pages may still be configured to publish the previous development branch, `increment-11-extraction-feasibility`. After merging, verify **Settings → Pages → Build and deployment** points to `main` for production. The merge alone does not change Pages settings.

## Historical note

This repository replaced the abandoned App Graphics Workshop working tree. The earlier code remains accessible in Git history at commit `bb8a90d145c900ae30ffe3f170e71af20c8698b5`. The README previously described only the original feasibility prototype and was updated after Increment 11 to document the actual production functionality.
