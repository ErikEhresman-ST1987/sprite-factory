# Sprite Factory — Production Status and Development History

**Updated:** 2026-10-31  
**Source of truth:** `main` branch of `ErikEhresman-ST1987/sprite-factory`  
**Purpose:** Preserve the current working map of the project, its development decisions, and how to use the tools. This is a practical handoff, not a claim that every historical experiment was preserved.

## Where to start

- [Game Graphics Workshop home](workshop/index.html) — choose the appropriate tool.
- [Sprite Factory](index.html) — prepare transparent sprites, sprite sheets, and game backgrounds as WebP.
- [Scene Editor](workshop/scene-editor/index.html) — position artwork and define scene interactions and reusable visual locations.
- [Animation Studio](workshop/animation-studio/index.html) — assemble individual frames into an aligned animation and export its WebP/JSON.
- [Existing README](README.md) — older detailed technical and incremental notes; some status language predates the October 31 consolidation.

Published entry point: https://erikehresman-st1987.github.io/sprite-factory/workshop/

**Use the production links above.** Development and test pages are historical references, not the standard workflow.

## Current functions and how to use them

### 1. Sprite Factory — sprite preparation

Open **Sprite Factory** and select **Sprite**. Import a source image. Choose white-background removal or color-key removal; for color-key artwork, specify or sample the background color and adjust tolerance. Optional controls include enclosed-background removal and edge cleanup. Set output dimensions and create the WebP, inspect the preview, then download.

**Accepted decision:** The production color-key/edge-cleanup implementation (referred to in development as **Version 3**) supersedes the older `feature/color-key-edge-cleanup-v2` experiment. The user repeatedly tested Version 3 and found it materially better. Do not restore V2 over production.

### 2. Sprite Factory — background creation

Select **Background** (not Scene Editor). Import scenery. Choose a screen-size preset or enter custom width and height; the tool scales to **fill** the output without stretching and crops excess edges.

Presets include landscape **1280×720**, **1920×1080**, **1024×768**; portrait **360×640**, **720×1280**, **1080×1920**; and tall scrolling **720×2560**. Portrait dimensions put the shorter side across the top/bottom and the longer side vertically. Custom dimensions are supported within the app's limits (1–4096 pixels per dimension).

The **cropping diagnostic** estimates the portion of the image that will be cut off because of aspect-ratio mismatch. It is a geometric estimate, not content-aware analysis. After **Create WebP**, the **scrolling background preview** repeats the processed image vertically; use **Play/Pause** and **Speed** to inspect joins or seams. This preview does not make an image seamless and does not modify the exported WebP. Download the verified WebP separately.

**Important for Pop Squadron:** The portrait presets, crop notice, and scrolling preview belong to Sprite Factory's **Background mode**. They are not Scene Editor features.

### 3. Sprite Factory — sprite-sheet preparation

Select **Sprite Sheet**. Import source artwork, choose the number of frames and cell size, select alignment and extraction method, and use source diagnostics where appropriate. Create and inspect the WebP; use the animation preview and speed control to check movement before downloading. For precise manual frame placement, use Animation Studio instead.

### 4. Animation Studio

Open **Animation Studio**. Add individual frames, select frames, align or center them on the shared canvas, and play the animation at a chosen speed. Choose export frame size and use **Prepare WebP and JSON**. Download **both** the WebP image and JSON metadata. The studio also supports an editable project download and reopen for later adjustments.

### 5. Scene Editor — composition and interactions

Open **Scene Editor**. Load a background, then load and position sprite artwork. Set scene dimensions as needed; adjust selected sprite size, rotation, and layering. For an animation, choose a sprite strip and apply its animation JSON to the selected sprite.

Use sprite interaction zones and background hotspots for clickable areas. **Download project** saves an editable scene file; **Open project** reloads one. **Export game placement JSON** produces placement information for game integration. These are different outputs; keep the editable project when you expect to revise the scene.

### 6. Scene Editor — reusable visual locations / farm plots

The production Scene Editor includes the latest crop-plot assembly workflow:

1. **Add location** for a plot or other reusable scene assembly.
2. **Load permanent foundation** for the always-visible base (for example, empty soil).
3. Define the plot's **interaction zone**.
4. **Add choice** for alternatives (for example, different crops).
5. **Add appearance** for visual stages (for example, growth stages) and load their images.
6. Use **Move entire location** to reposition the assembly together, or edit the foundation and plot zone individually.
7. **Duplicate location** to make another plot with the same structure; reposition the duplicate.
8. **Download project** for editable work and **Export visual locations JSON** for integration.

The latest production implementation draws all permanent foundations while editing a selected appearance. This addresses the earlier test problem where duplicating a plot made the original foundation disappear.

**Caution:** The October 31 source-code consolidation is committed, but a complete save → reopen → verify-all-assemblies test has **not** been reported as passed. Until tested, save an early small test project, reopen it, and verify foundation, choices, appearances, zones, and duplicates before investing extensive placement work. There is no documented autosave guarantee; explicitly download project files.

## Development history — known milestones

This is a **selected history supported by the repository review and development handoff**, not a complete chronological commit log.

| Period / work | Result |
| --- | --- |
| Early Sprite Factory | Browser-based WebP preparation for sprites, backgrounds, and animation sheets; iPad Safari workflow. |
| Increments 10–11 | Sprite-sheet extraction, diagnostics, and alignment work; earlier details remain in the README and repository history. |
| Game Graphics Workshop | Separate launch points for Sprite Factory, Scene Editor, Animation Studio, and engine verification. |
| Scene Editor animation placement | Animation strip and JSON attachment integrated into production. |
| Reusable visual locations / crop plots | Foundations, choices, appearances, interaction zones, duplication, and moving whole locations developed and tested on a separate editor page. |
| All-foundations-visible correction | Corrected test editor so duplicated crop plots retain visible original foundations. |
| **2026-10-31 Scene Editor consolidation** | Latest assembly-test editor content promoted to production `workshop/scene-editor/index.html` on `main` (commit `f74ae9c`). |
| Repeated file-picker fix | Production source retains the file-input reset needed for repeated image selection. |
| Color-key edge cleanup | User confirmed production V3 outperformed V2 in repeated tests; V2 declared superseded. |
| **2026-10-31 Background restoration** | Portrait/tall presets, cropping diagnostics, and vertical scrolling preview ported from Increment 12 into production `index.html`, `app.js`, and `style.css`. |
| **2026-10-31 crop notice correction** | Corrected asynchronous source-change check in production `app.js` (commit `50219e5`). |

## Branch audit and repository status

A full comparison was performed before the October 31 background restoration:

- Six historical branches had **no unique commits** relative to `main`: `backup/workshop-4a1-accepted-20261026`, `deploy/color-key-test-page-20261029`, `development/reusable-visual-locations-5a`, `development/workshop-home-increment-1`, `increment-10a-sprite-sheet-ui`, and `increment-11-extraction-feasibility`.
- `development/scene-animation-placement` and `development/scene-location-foundation` were superseded by the newer production Scene Editor implementation.
- `fix/repeated-artwork-picker-20261029` and `feature/sprite-color-key-20261029` were superseded by later production code.
- `feature/color-key-edge-cleanup-v2` was explicitly rejected in favor of tested V3.
- `increment-12-background-preview` contained useful missing features; **its portrait presets, crop diagnostics, and scrolling preview were ported to `main` on October 31**, without replacing newer production sprite-processing code.

**Branch deletion has not been performed.** Branches may still exist on GitHub; their presence does not mean they are the production source. Do not merge older branch files wholesale into `main` without comparing against current production. Branch pruning, if desired, must be completed through GitHub's branch management UI or a suitably authorized tool.

## Current status and practical rules

- **Development source of truth:** `main`. Use the production Workshop and its links.
- **Code integration:** The Scene Editor assembly implementation and the three recovered Background-mode features are committed to `main`.
- **Verification:** JavaScript syntax and relevant UI element references were checked during restoration. This is **not** the same as successful end-to-end testing in iPad Safari. Browser testing remains to be done.
- **Working files:** Keep editable project JSON alongside exported WebP and placement/animation JSON where applicable. An exported game-placement JSON is not a substitute for an editable project.
- **No more branch confusion:** New development should begin from current `main`; use isolated test branches only for work that truly requires isolation, and reconcile each accepted change back to `main`.
- **No need to recover every abandoned experiment:** The accepted production behavior and a clear current workflow take priority over preserving unused prototypes.

## Short next verification checklist

1. In **Sprite Factory → Background**, confirm portrait presets, crop notice, scrolling preview, and successful WebP download.
2. In **Sprite Factory → Sprite**, confirm color-key V3 still processes a sample cleanly and repeated image selection works.
3. In **Animation Studio**, verify frame import, preview, WebP and JSON export.
4. In **Scene Editor**, create a foundation, crop choice and appearance, duplicate it, download the project, reopen it, and verify both plots and zones survive.
5. Only after those checks, treat the consolidated production tools as fully acceptance-tested.

---
*Maintained as a human-readable production handoff. Update this file when accepted changes alter tools, workflows, or known limits.*
