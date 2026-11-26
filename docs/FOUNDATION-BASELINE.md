# Foundation consolidation — Increment 0
Status: baseline preserved; static inventory complete for four known runtime entry points; device acceptance pending.
Baseline: 6e3bc08fb7d8ba9a18ec2e6feaa27b512db2f086
Recovery: backup/foundation-baseline-20261126
Working branch: development/foundation-consolidation

## Guardrails
No new features or production changes in Increment 0. Preserve URLs, editable project formats and game export contracts. One authoritative implementation per shared capability, with explicit options for differing behaviors. UI controllers must not be required by shared processing. Extract incrementally, verify each migration, avoid empty abstractions. Never merge until acceptance. Historical iPad acceptance is not a new test.

## Source inventory (baseline)
| Source | Blob SHA | Existing responsibilities |
|---|---|---|
| app.js | b66d0e574521d1db07ab1538f7e1b9a649dc85ca | five modes; sampling, key matching, flood fill, edges, crop, resize, sheet extraction, previews, five WebP paths |
| workshop/scene-editor/index.html | 8330ddbf02d1c91864a0c22b84d4f1802a0ee14d | image decode/read; scene geometry, rendering, hotspots, visual locations, save/load and placement exports |
| workshop/animation-studio/index.html | d6892270f56cf20cfe5394a420754c39b16333a5 | decode/read, frame alignment, timing, strip rendering, WebP, metadata, project IO |
| workshop/engine-verification/index.html | d0bacc57d8ad51bcb2ca1012567280daed0aae53 | JSON/image loading, URL lifecycle, diagnostic engine adapters |

## Consolidation map
- WebP: app.js sprite handler, createSceneGraphic, createStandardImage, createBackground, createSheet; Animation Studio exportWebp handler. Six toBlob call sites. Preserve quality, retry behavior, signature/dimension checks and mode-specific alpha policy; do not assume opaque output is invalid.
- Loading: app.js createImageBitmap (14 references); Scene Editor image/read/loadImage; Animation Studio decode/read; Engine Verification bitmap/fileUrl. Preserve data URLs for editable project persistence and object URLs for ephemeral usage.
- File lifecycle: all four entry points create/revoke object URLs; Scene Editor and Animation Studio duplicate FileReader and download patterns. Preserve separate user-initiated WebP and JSON downloads.
- Geometry: app.js crop/fit and sheet bodyAnchor; Scene Editor setDimensions/defaultZone/coords and visual location geometry; Animation Studio dimensions/point and export placement. Share pure geometry only where semantics agree.
- Pixel processing: app.js parseKeyHex/keyMatches/removeEnclosedKey/removeEnclosedWhite and sprite/scene/sheet paths. Inventory differences in alpha thresholds, edge cleanup and connected versus all-match removal before extracting.
- Canvas: drawImage in all four tools; centralize allocation/cleanup and reusable transformations, not UI-specific rendering.
- Animation: app.js animationTick/backgroundScrollFrame and Animation Studio tick; preserve timing and playback semantics; shared pure frame calculations only when appropriate.
- Validation: JSON parsers in both editors and verification page; share primitives, retain format-specific contracts.
- Dependencies: @jsquash/webp 1.5.0 via esm.sh; scene mode additionally retries jsDelivr and bundled esm.sh; engine test page uses CDN PixiJS major 8 and Phaser major 3. Pin exact tested versions before local hosting. Offline fallback not verified.

## Defect register
F01: Scene Editor setDimensions shadows scene height with hotspot loop variable; height expression uses object arithmetic. Also inspect boundary clamping and scale=false semantics. Reproduce and fix in Increment 1.
F02: EXPORT-CONTRACT-v1.md describes animation v1 while current exporter emits v2 (id/playback/loop). Verify reader compatibility before documenting.
F03: duplicated encoder paths with inconsistent fallback and verification.
F04: remote dependencies prevent guaranteed offline operation; local hosting alone does not guarantee offline cache.
F05: editor logic inline and duplicated IO utilities.
F06: regression guide predates visual locations and newer modes. Expand below.

## Baseline manual test protocol (all pending unless explicitly recorded)
Use existing production app on iPad Safari, retain original test files and output artifacts locally. Record date, browser, source filenames, dimensions, mode/settings, expected/observed result, pass/fail, and screenshots or errors. Never overwrite master projects.
- B01 Sprite: white and sampled-color backgrounds, enclosed matching areas on/off, edge cleanup, autoCrop on/off, fit, custom size. Verify transparency, dimensions, details and actual WebP.
- B02 Background: cover crop landscape/portrait/tall, scroll preview; verify opaque export and expected dimensions.
- B03 Standard: aspect preservation, quality, max size; verify WebP.
- B04 Scene Graphics: original-size transparent cockpit with enclosed window removed; opaque half-height exterior, contain/cover and custom dimensions.
- B05 Sheet: equal-width extraction, smart/connected diagnostics and extraction with known valid/invalid layouts, alignment modes and preview; reject over 4096 width.
- B06 Re-select same and different image; change modes; repeated export; no stale download.
- B07 Scene Editor: background, sprites, drag/resize/rotate/layer, touch zones, two hotspots, save/clear/reopen/revise/export. Verify stable IDs, valid coordinates, invisible game zones, malformed import preservation.
- B08 Scene resize with hotspots: export before and after; check all coordinates and dimensions finite, positive and bounded. Expected known defect F01 may fail; record rather than repair baseline.
- B09 Visual locations: foundation, choices/appearances, duplicate/move assembly, touch zone, save/reopen, visual-location JSON and paths.
- B10 Animation: import four individual frames, ghost, align, preview, save/reopen; name and export each playback setting separately; verify strip dimensions, signature, metadata and download invalidation after edits.
- B11 Engine Verification: actual placement and animation files in both engines; test hotspots, outlines off, missing asset, wrong project type, mismatched strip, engine switching. Check v2 support explicitly.
- B12 Offline: after normal load, airplane mode and fresh launch where feasible; record which features and fallback encoders work. Do not claim offline support from local processing alone.
- B13 Repeat existing workshop/RELIABILITY-REGRESSION-4B.md checklist.
- B14 WebP stress: realistic source sizes, repeated processing, max supported output, malformed input and transparent/opaque mode policies; record errors and memory symptoms.

## Exit gate
Recovery and development branches verified at baseline initially. Static inventory covers known entry points, not an exhaustive repository tree (connector limitation). No runtime tests executed as part of this increment yet. Complete user-observed baseline tests (known failures may be documented), then approve Increment 1. Do not label baseline accepted before testing. Preserve original production branch.
