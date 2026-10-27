# Game Graphics Workshop — Export Contract v1 (Increment 4A)

Status: **Workshop-to-engine verification accepted on iPad** for sprite placement, animation playback, and background hotspots in PixiJS v8 and Phaser 3. This is a contract for exports, not a claim that Little Field Farm already imports them.

## Scene placement JSON (existing exporter; format `game-graphics-placement`, version 1)

- `canvas.width` and `canvas.height`: positive integer scene dimensions in logical pixels. These are not the editor's displayed CSS pixels.
- `background`: asset path string or null. Current exporter emits `REPLACE_WITH_GAME_BACKGROUND_ASSET_PATH` until replaced by the game developer.
- `hotspots`: zero or more background-only interactive rectangles with stable `id`, editable `name`, `action` (interaction key), `x`, `y`, `width`, `height`, and `type: "rectangle"`. Coordinates are scene pixels, top-left based. These areas are **invisible in gameplay**; Scene Editor and optional engine diagnostics can display outlines. The game must map `action` to behavior.\n- `objects`: ordered back-to-front. Each object has `id`, `name`, `asset`, `x`, `y`, `width`, `height`, `rotation`, `layer`, and `touchZone`.
- `x`, `y`: **center** of sprite in scene coordinates, origin at top left, x rightward, y downward.
- `width`, `height`: displayed sprite size in scene pixels, prior to rotation.
- `rotation`: **degrees clockwise** in canvas screen coordinates. Convert to radians for PixiJS: `rotation * Math.PI / 180`.
- `layer`: zero-based drawing order (higher layer renders in front).
- `touchZone`: `{type:"rectangle",x,y,width,height}`; **axis-aligned**, top-left-based scene rectangle, independent of sprite rotation.
- `asset`: placeholder `REPLACE_WITH_GAME_ASSET_PATH/<original filename>`. Replace it with an actual game asset path. The export does **not** bundle image bytes or copy images into the game.

PixiJS v8 adapter guidance: create sprites with anchor `0.5`; set `position.set(x,y)`, `width`, `height`, `rotation` (radians), and order by `layer`. Transform pointer coordinates into **scene coordinates** before rectangle hit-testing. The game is responsible for scaling the logical scene to its viewport; do not apply viewport scaling to exported coordinates twice.

## Animation metadata JSON (new exporter; format `game-graphics-animation`, version 1)

Animation Studio downloads a WebP horizontal strip and a matching JSON metadata file:
```json
{
  "format": "game-graphics-animation",
  "version": 1,
  "asset": "animation-4frames-256px.webp",
  "frameWidth": 256,
  "frameHeight": 256,
  "frameCount": 4,
  "fps": 6,
  "layout": "horizontal",
  "loop": true
}
```
The filename and numbers above are examples. Each frame occupies `[index * frameWidth, 0, frameWidth, frameHeight]` in the strip. `frameCount * frameWidth` must equal image width, and image height must equal `frameHeight`. `fps` controls game playback; the WebP itself is not animated. The game should load the WebP and JSON from the same asset directory or resolve `asset` explicitly.

## Compatibility and boundaries

- Editable scene projects (`game-graphics-workshop-scene`, version 1/2/3) and editable animation projects (`game-graphics-workshop-animation`, version 1) are **not** game placement exports. Keep them for future edits.
- Scene dimensions currently range 100–4096 in each axis. Animation cell sizes are 128/256/512 and total strip width <= 4096.
- No automatic sprite/animation attachment, no polygon hit zones, no built-in game loader, and no multi-row atlas support.
- The iPad WebP encoder may use a network-loaded WebAssembly fallback; offline fallback encoding is not guaranteed.
- Completed iPad acceptance: WebP and JSON downloads, animation playback, scene placement, and sprite/background hotspot interactions in PixiJS v8 and Phaser 3. Full scene-background asset integration in the game remains unverified. Do not modify the working Little Field Farm game just to perform this test.
