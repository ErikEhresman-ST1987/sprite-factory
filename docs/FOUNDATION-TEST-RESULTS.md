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

B07–B14 pending.
