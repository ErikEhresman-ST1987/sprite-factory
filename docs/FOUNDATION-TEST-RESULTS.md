# Foundation baseline test results

Baseline: 6e3bc08fb7d8ba9a18ec2e6feaa27b512db2f086

## B01 — Individual sprite processing — PASS (2026-11-26)
User-reported: image loading, background removal, subject details, centering/sizing, transparent preview, successful WebP verification and Files download all passed. No observations or errors reported. Source filename and exact settings not independently recorded; alternate B01 protocol settings remain untested. No independent browser execution.

## B02 — Background processing — PASS (2026-11-26)
User-reported: loading, dimensions/cropping, proportions, scrolling preview, image quality, WebP verification and Files download all passed. No observations. Alternate dimensions and source specifics not independently recorded.

## B03 — Standard image processing — CONDITIONAL PASS (2026-11-26)
All six checks eventually passed: load, resize, proportions, quality, WebP verification and download. User observation: The picture wouldn’t load on the first try, it worked after I reloaded the page.

F07 — Intermittent image-loading failure: investigate mode transitions, file selection, decode lifecycle and error handling; cause unknown. Retest in B06 before assigning root cause. Reload is workaround only. Source/settings and error message not recorded.

## B04 — Scene graphics — PASS (2026-11-26)
User-reported: first-attempt loading, enclosed window removal, surrounding artwork, transparency, dimensions, WebP verification and Files download all passed. Observation: Everything worked. Opaque exterior and alternate sizing configurations not separately verified. F07 remains open.

## B05 — Sprite-sheet processing — PASS (2026-11-26)
User-reported: first-attempt loading, frame count, extraction, background removal, alignment, preview, WebP verification and Files download all passed. Observation: It all worked. Alternate extraction layouts, invalid inputs and width limits not independently verified.

## B06 — Repeated imports/mode switching — FAIL (2026-11-26)
User reported: Couldn't load anything. I didn't refresh. F07 elevated to high priority. Exact failed step, picker behavior and app state not yet established. Do not infer root cause. Remaining B06 operations blocked/unverified. Preserve current page for diagnosis if possible.

### F07 diagnostic follow-up
User confirms native picker never opens in any of the five modes; settings, instructions, other inputs and buttons continue to respond. Switching modes does not restore picker. Source inspection confirms a single native input id=file shared by all modes, change handler resets value to empty string; no obvious code disabling input. Earlier refresh restored functionality. General UI freeze not supported by observations; Safari picker lifecycle, hit testing and resource lifecycle remain candidates, not confirmed causes. Follow-up: user confirmed refresh instantly fixed the issue. Recovery confirmed, root cause unknown. Prioritize Increment 1 investigation; B06 remains failed.

## B07 — Scene Editor — PASS (2026-11-26)
User-reported: background and sprite loading, position/size/rotation/layering, sprite touch zones, background hotspot creation/editing, editable save/reopen, artwork/position/hotspot preservation and game placement export all passed. Observation: Everything worked. Stable IDs and malformed imports not independently inspected.

## B08 — Scene resizing and hotspot preservation — PASS (2026-11-26)
User-reported: scene dimensions, background/sprite resizing, hotspot visibility, position and size adjustment, editability and placement JSON export all passed. Observation: Seems to have worked. Exported JSON not supplied or independently inspected; finite/bounded coordinates and exact resizing path remain unverified. F01 remains open as a static code finding, not a reproduced runtime failure.

## B09 — Reusable visual locations — PARTIAL (2026-11-27)
Additional submission labeled B08 repeated all seven passes and stated: I created the duplicates of the switched zone, and cleared and reloaded project It worked. Record duplication, switching and project recovery as reported observations; remaining B09 checks and visual-location export require confirmation. Do not count B09 as full pass yet.

### B09 final confirmation — PASS
User confirms foundation and alternative artwork display, duplicated location repositioning, touch zone configuration and visual location JSON export all passed. Together with earlier reported switching, duplication and project recovery, B09 functional protocol is passed. Export contents not independently inspected.

## B10 — Animation Studio — PASS
User reports all eleven checks passed: multiple frames, alignment, onion skin, speed, preview, naming, playback setting selection, editable save/reopen, WebP strip export, metadata JSON export and export invalidation on settings change. No observations. Individual playback semantics and exported metadata contents not independently verified.

## B11 — Engine verification — FAIL (partial testing)
Screenshots show both PixiJS v8 and Phaser 3 selections reject animation (1).json with 'Animation JSON is not a supported Workshop export.' Scene files not selected. Static inspection of main confirms verifier accepts version 1 only while Animation Studio emits version 2. F08: confirmed incompatible exporter/importer contracts; specific uploaded JSON contents not inspected. Engine initialization, sample rendering and scene placement remain unverified. Plan backward-compatible shared validation and playback semantics verification in foundation repair.

B12–B14 pending; B11 remaining checks pending.

### B11 follow-up
Screenshots confirm both engines render built-in sample assets. Missing WebP with JSON selected correctly triggers paired-file validation. Both samples display misleading zero-background-hotspots export warning with no placement uploaded; investigate warning scope. Animation motion, touch interaction and actual scene imports remain unverified. B11 remains failed due to F08.

### B11 touch follow-up
PixiJS selected screenshot displays PASS: PixiJS sprite touch zone tapped. Phaser selected screenshot displays same PixiJS message; selector alone does not establish active engine. PixiJS touch passed; Phaser touch pending explicit run and tap. Imported scenes remain untested.

### B11 Phaser confirmation
Screenshot shows Phaser 3 selected and 'PASS: Phaser touch zone tapped. Sample assets rendered.' Both engines now confirmed for built-in rendering and touch interaction. Imported scene placement and background hotspot interaction remain unverified; animation export incompatibility remains failed.

### B11 baseline closure
User deleted temporary exported assets after workflow confusion. Defer imported scene and background hotspot checks to repair phase; no repeat scene construction required now. B11 remains failed for confirmed animation compatibility defect; sample rendering and touch pass in both engines. Proposed reusable regression fixtures for future testing, not yet created. Sample animation motion not explicitly confirmed.

## B12 — Main workspace offline — PASS (limited scope)
User reports offline image loading, processing, WebP export and page reload all passed. Workshop offline operation, cold launch and fallback encoder availability remain untested. Continue with workshop offline checks.

## Scope revision — 2026-11-27
User explicitly states offline is no longer a priority. Existing offline behavior may be preserved where practical, but comprehensive offline testing, cold launch and offline dependency availability are no longer mandatory foundation acceptance gates. B12 main workspace passed; remaining offline checks waived, not verified. Offline dependency consolidation is optional rather than required; dependency reliability remains relevant. This revision supersedes earlier conflicting offline requirements for Sprite Factory only.

## B13 — Reviewed with outstanding defects
Reviewed workshop/RELIABILITY-REGRESSION-4B.md and current main app.js, scene editor and animation studio source against B01–B12 observations. Existing checks cover separate downloads, invalidation, project recovery and validation. F07/F08 remain confirmed failures; F01 remains static finding. Checklist is stale (scene import accepts versions 1–4, animation export v2). Bitmap and object URL cleanup exists but differs by path. Deferred targeted runtime checks: malformed/mismatched imports, stable IDs, empty hotspot names/keys, invisible tappable zones, actual scene/animation rendering in both engines, canvas cleanup, large scene. Static review is not runtime acceptance. User approved minimizing repeated tests. B14 remains pending.
