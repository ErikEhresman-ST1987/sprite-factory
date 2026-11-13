# Scene Editor — AI Capability Reference

**Production UI:** `workshop/scene-editor/index.html`. **Purpose:** Compose existing artwork and export scene data; not image generation or the same tool as Sprite Factory's Scene Graphics mode.

## Workflow and artifacts
1. Load background and sprites; position, size, rotate, and order visual objects on a logical scene canvas.
2. Define sprite touch zones and invisible background hotspots with game-defined actions.
3. **Download project**: editable `workshop-scene.json` (project format `game-graphics-workshop-scene`, versions 1/2/3). **Open project** loads this for revision. Keep this master file.
4. **Export game placement JSON**: game-facing `game-placement.json`, root `format: "game-graphics-placement"`, `version: 1`. This is **not** reimportable editable source.
5. For reusable locations, define a permanent foundation, choices and appearances, interaction zone, move/duplicate assemblies, and **Export visual locations JSON** as a companion game-facing artifact.

## Export contract
See [placement and animation contract](workshop/EXPORT-CONTRACT-v1.md) and [visual locations contract](workshop/VISUAL-LOCATIONS-CONTRACT-v1.md).
- Scene coordinates are logical pixels, origin upper left. Sprite `x/y` are **centers**; hotspot/touch-zone `x/y` are **top-left corners**.
- Sprite rotation is clockwise degrees; `layer` controls draw order. Touch rectangles are axis-aligned and independent of rotation.
- Exported image paths are placeholders; image bytes are **not** bundled into placement JSON. Game developers must copy assets and replace paths.
- Interaction `action` keys do **not** implement gameplay; the game must map them to handlers.
- The visual-locations companion export uses stable IDs to select appearances; it does not implement growth timers or game state.
- Contract note: the visual-locations editor currently omits optional `touchZone` in its export; do not assume that field is present.

## Verification status and cautions
Earlier placement, hotspots and editor save/reopen workflows were user-tested on iPad with isolated PixiJS v8 and Phaser 3 verification. Later reusable-location assembly was promoted to production on 2026-10-31; full save/reopen/duplicate verification and complete asset-bundle integration were not reported as passed in the production handoff. Verify these separately before claiming full reliability. No autosave guarantee: explicitly download editable projects.

**Critical:** Never tell the user to reimport `game-placement.json` to edit a scene. Use the editable project file. Consult [production status](PROJECT-STATUS-AND-HISTORY.md).
