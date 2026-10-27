# Game Graphics Workshop — Practical Workflow

This guide describes the tested Workshop workflow. It does not claim that Little Field Farm already imports every export automatically.

## Choose the tool

| Tool | Purpose | What to keep |
| --- | --- | --- |
| [Sprite Factory](../index.html) | Prepare individual transparent WebP sprites, backgrounds, or horizontal sprite sheets | Final WebP files and original source artwork |
| [Scene Editor](scene-editor/index.html) | Compose a background, position sprites, and draw interactive areas | Editable `workshop-scene.json` plus game `game-placement.json` |
| [Animation Studio](animation-studio/index.html) | Align individual animation frames, preview, and export a horizontal WebP strip | Editable animation project, WebP strip, and matching animation JSON |
| [Engine Verification](engine-verification/index.html) | Load exported files in PixiJS v8 or Phaser 3 and test interactions | Test results; no game files are modified |

## Scene workflow — create, revise, and export

1. Prepare artwork in Sprite Factory if needed. Keep the original files.
2. In Scene Editor, load a background, then add and position sprites.
3. Add **background hotspots** for areas already painted into the background (doors, machinery, paths, etc.). Their outlined boxes and labels are visible **in the editor only**. Gameplay hotspots are invisible and interactive.
4. Give every hotspot a descriptive name and nonempty interaction key, such as `open_farmhouse`. Stable IDs survive saving and reopening.
5. Choose **Download project** to save an editable `workshop-scene.json`. This is your **master scene** and includes the embedded artwork needed for reopening.
6. Choose **Export game placement JSON** to download `game-placement.json`. This is the **game-facing export**, not the editable project. It records scene dimensions, sprite placement and touch zones, and background hotspots; sprite image bytes are **not** embedded.
7. In Engine Verification, select the placement JSON and original sprite image files under **Scene images**. Select PixiJS or Phaser and run verification. Use **Show hotspot outlines for testing only** to locate the hotspots; disable it to verify invisibility.
8. In the game repository, map placeholder asset paths and interaction keys to real game assets and game behavior. The Workshop does not write to the game automatically.

### Revising an existing scene

Open the saved **editable project**, move or resize sprites/hotspots, and download the project again. Then **export game placement JSON again**. Keep the previous working files in version control until the new export passes game verification. Don't use the placement JSON as a substitute for the editable project.

## Animation workflow

1. In Animation Studio, load individual frame images, align them, and preview playback at the desired FPS.
2. Save the editable animation project for future revisions.
3. Choose **Prepare WebP and JSON**, then use **Download WebP image** and **Download JSON metadata** separately. This avoids Safari issues with back-to-back downloads.
4. Keep the two files together. The WebP is a **static horizontal strip**; the JSON supplies frame dimensions, count, FPS, and looping information. Neither file alone is a self-playing animation.
5. In Engine Verification, choose the matching WebP and animation JSON, then test playback in PixiJS and Phaser.

## Common errors

- **“Editable Scene Editor project”** in Engine Verification: you chose `workshop-scene.json` instead of `game-placement.json`. Return to Scene Editor and choose **Export game placement JSON**.
- **“Missing scene image: filename”**: choose that exact original artwork file under **Scene images**. Placement JSON stores references, not pixels.
- **“Export blocked”**: select each hotspot and supply both a name and an interaction key.
- **Animation filename or dimensions mismatch**: download the WebP and JSON from the **same preparation**. Avoid mixing older files from Downloads.
- **No downloaded WebP in Safari**: use the dedicated **Download WebP image** button after preparing the export; check Files → Downloads.
- **Hotspots seem untappable**: enable testing outlines, confirm the export lists the expected hotspots, and test away from overlapping sprite touch zones.

## What was actually verified

On iPad Safari, user acceptance testing confirmed editable scene save/reopen/revision, exported scene placement, sprite touch zones, two background hotspots in both PixiJS v8 and Phaser 3, and Animation Studio WebP + JSON exports and playback. The reliability regression tests were accepted as Increment 4B.

## Limits and maintenance

- Engine Verification is an isolated test page, not a complete game importer.
- Game-specific interactions and actual asset paths must be implemented in the game.
- The editor's outlines are diagnostic/editor-only; background hotspots must remain invisible in gameplay.
- Scene background-image import into the game was not part of the completed dual-engine acceptance.
- WebP fallback encoding may require an external WebAssembly module and network access.
- The accepted 4A.1 recovery branch is `backup/workshop-4a1-accepted-20261026`. Subsequent development is on `development/workshop-home-increment-1`.
- Before changing an accepted workflow, consult [4B regression checklist](RELIABILITY-REGRESSION-4B.md) and [export contract](EXPORT-CONTRACT-v1.md).
