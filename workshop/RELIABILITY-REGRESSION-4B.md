# Increment 4B — Reliability regression checklist

Baseline: accepted Increment 4A.1. Recovery branch: `backup/workshop-4a1-accepted-20261026`.

## Export contract and Safari
- [ ] Animation Studio: prepare 4-frame WebP; download WebP and JSON separately in Safari; both exist in Files → Downloads.
- [ ] Verify the actual WebP and JSON in PixiJS and Phaser. Both animate at selected FPS.
- [ ] Change FPS, alignment, or export size after preparing: both download buttons must disable until re-prepared.
- [ ] Invalid animation metadata and a mismatched WebP must produce readable errors, not a false PASS.

## Scene Editor
- [ ] Background + sprite + two hotspots: save project, clear, reopen; all artwork, IDs, interaction keys, positions, and sizes persist.
- [ ] Revise one hotspot and re-export; stable IDs remain unchanged.
- [ ] Empty hotspot name/key blocks game export with an actionable message.
- [ ] Show/hide outlines changes editor visibility only; game hotspots stay invisible.
- [ ] Game placement export contains `format: game-graphics-placement`, `version: 1`, and `hotspots`.
- [ ] Editable project contains `format: game-graphics-workshop-scene` and `version: 3`.
- [ ] Reject malformed project imports without replacing the currently loaded scene.

## Engine verification
- [ ] Selecting editable `workshop-scene.json` as Placement JSON explains how to export `game-placement.json`.
- [ ] Missing sprite image gives its expected filename and tells user to choose it under Scene images.
- [ ] PixiJS and Phaser both render actual exported scene artwork and sprite touch zones.
- [ ] Both exported background hotspots respond in each engine; names/keys match export.
- [ ] With diagnostic outlines disabled, hotspots remain invisible and tappable.
- [ ] Switching engines and rerunning does not leave an old canvas behind.
- [ ] Test with a scene larger than 640×360 on iPad Safari.

## Scope / known limitations
- Game placement JSON references sprite paths; it does not embed images.
- Background asset integration and in-game interaction behavior remain the responsibility of the game.
- Animation Studio's WebAssembly WebP fallback uses an online module; fully offline fallback is not guaranteed.
- A commit and static inspection do not constitute iPad Safari acceptance. Record user-observed results before marking 4B complete.
