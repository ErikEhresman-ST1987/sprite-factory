# Reusable Visual Locations — Export Contract v1 (Increment 5A)

Status: **implemented v1 companion contract**. This is an optional export, not a replacement for existing `game-graphics-placement` v1 or editable scene files. The adapter and simplified WebP engine demonstrations were verified on iPad in PixiJS v8 and Phaser 3; full exported artwork bundles are not yet end-to-end verified.

## Purpose

Allow one named location to offer multiple choices, each with multiple appearances. Every appearance has its own asset and precise placement. A game selects an appearance by stable identifiers; the editor never determines gameplay progression.

Examples: `bed-04 / wheat / growing`; `construction-site-01 / habitat / complete`.

## Companion JSON

Filename: `game-visual-locations.json`. Root `format: "game-graphics-visual-locations"`, `version: 1`.

```json
{
  "format": "game-graphics-visual-locations",
  "version": 1,
  "canvas": {"width": 1024, "height": 768},
  "locations": [
    {
      "id": "bed-01",
      "name": "Bed 1",
      "action": "interact-bed-01",
      "touchZone": {"type": "rectangle", "x": 120, "y": 310, "width": 110, "height": 85},
      "choices": [
        {
          "id": "wheat",
          "name": "Wheat",
          "appearances": [
            {
              "id": "growing",
              "name": "Growing",
              "asset": "assets/wheat-growing.webp",
              "x": 175,
              "y": 342,
              "width": 100,
              "height": 88,
              "rotation": 0,
              "layer": 5
            }
          ]
        }
      ]
    }
  ]
}
```

## Meaning and validation

- IDs are stable, nonempty strings and unique **within their parent scope**: location IDs within the scene, choice IDs within a location, appearance IDs within a choice. Duplicating a location MUST assign a new location ID; copied choice/appearance IDs remain unchanged so gameplay selection remains consistent.
- Names are human-readable editor labels; gameplay must use IDs, not names or array positions.
- `action` is an optional game-defined interaction key; `touchZone` is an optional invisible, axis-aligned rectangle in scene coordinates. They do not implement game behavior.
- `asset` is a relative game asset path (no embedded image bytes); the exporter must reject missing assets, malformed placement, invalid identifiers, and duplicate IDs. The game must supply/copy the referenced WebP files separately.
- `x`/`y` are **sprite centers**, top-left scene origin, x right, y down. `width`/`height` are positive unrotated displayed dimensions; `rotation` is clockwise degrees; `layer` is draw order. These conventions match placement v1. Validate finite numeric coordinates and dimensions and supported scene bounds.
- An unselected choice/appearance is **not rendered**. An empty location is represented by no selected appearance; the base bed/building site may remain a normal background or static sprite.
- Game API conceptual lookup: `getAppearance(locationId, choiceId, appearanceId)`. The game chooses IDs from its own saved state and timers; this file contains no crop rules, building timers, or game-specific logic.
- The renderer should display at most one appearance per location at a time, unless a future version explicitly introduces compositing.
- Duplicating a location translates all appearance centers and the touch zone by the same scene-space delta, preserving their relative sizes, rotations and layers. A duplicate is independently editable; shared artwork paths remain shared.
- Preserve existing ordinary scene exports and editor project loading. New visual-location data must be persisted in a backward-compatible, versioned editable project format. Old scene projects must still load.

## Acceptance gate

1. Create one location, two choices, two appearances per choice; align each visually and switch editor previews.
2. Duplicate and move the complete location, keeping relative alignment and assigning a unique ID.
3. Save/reopen/edit, validate and export the companion JSON without breaking existing scene placement exports.
4. In both PixiJS v8 and Phaser 3, select appearances by IDs and verify independent locations on iPad. Simplified WebP rendering passed; loading actual exported artwork paths and touch-zone behavior in both engines remains a separate integration test.
5. Test a crop scenario and a construction scenario with the same code; add automated contract checks and documentation.

**Implementation note:** Editor and adapter are implemented. The editor currently exports no `touchZone` property for visual locations; this optional field is supported by the adapter when supplied by game data. The demo's hit-test and renderer checks do not replace a complete asset-bundle integration test.
