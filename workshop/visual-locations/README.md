# Integrating Reusable Visual Locations (Increment 5C)

Use the Scene Editor's **Export visual locations JSON** action to obtain `game-visual-locations.json`. Copy the referenced WebP images into your game's assets folder, keeping the paths from the export. This JSON does not contain image bytes.

The adapter is a dependency-free ES module at `workshop/visual-locations/adapter.mjs`. It owns **which appearance is selected**, but does not decide when crops grow, buildings complete, or sprites animate.

```js
import { createVisualLocations } from './adapter.mjs';
const response = await fetch('./game-visual-locations.json');
if (!response.ok) throw Error('Visual locations JSON unavailable');
const visuals = createVisualLocations(await response.json());

// Each location starts empty until the game selects an appearance.
visuals.select('bed-01', 'wheat', 'growing');
visuals.select('bed-02', 'wheat', 'mature');
// Construction uses the same calls:
// visuals.select('construction-site-01', 'habitat', 'foundation');

// In your renderer's update step, synchronize the visible appearance list:
for (const item of visuals.visible()) {
  // Create/update ONE sprite for item.locationId with item.asset,
  // center position item.x/item.y, size item.width/item.height,
  // clockwise rotation item.rotation and draw order item.layer.
}

// To empty one location, without changing any other location:
visuals.select('bed-01');

// If pointer coordinates are already converted to scene coordinates:
for (const hit of visuals.hitTest(pointerX, pointerY)) {
  // Your game decides what to do with hit.locationId and hit.action.
}
```

## Renderer conventions

- Canvas coordinates are scene-space, origin top-left, x increases right, y increases down.
- Each appearance's x/y represent its **center**; width/height are display dimensions; rotation is clockwise degrees; layer is ordering. Convert degrees to radians in PixiJS or Phaser.
- **PixiJS v8:** use a Sprite with anchor (0.5, 0.5), set position and width/height, rotation in radians, and manage zIndex/sortableChildren (or sort sprites explicitly). Load textures via your game's asset loader.
- **Phaser 3:** use an Image with origin (0.5, 0.5), set position and displayWidth/displayHeight, angle in degrees, and depth from layer. Load textures in preload using your game's asset loader.
- Do not create new sprites on every frame. Keep a map of location ID → displayed sprite and update/reuse when state changes; remove or hide sprites for empty locations.
- Rendering is **not implemented by this adapter**. The host game must provide texture loading, display objects, pointer-to-scene conversion, and disposal.
- Each location is independent. A choice/appearance ID can be reused in different locations; only the location ID must be unique across the scene.
- A location can be empty. The base tile, bed, or construction pad can remain part of the background or ordinary scene artwork.

## Test commands and limits

Run `node --test tests/visual-locations.test.mjs` and `node --test tests/workshop-contract.test.mjs` from the repository root. These are logic/source checks; **they do not establish that PixiJS, Phaser, or iPad rendering works**. Those still need browser-based integration verification before production release.

## Current limitations

The editor currently requires a separately loaded image for each appearance in its editable project and exports only the WebP path. There is no automatic image bundling. Scene Editor projects may become large with many repeated data URLs. Artwork de-duplication and a verified engine demo remain future hardening tasks.
